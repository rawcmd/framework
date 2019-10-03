import { Option, OptionRecipe } from './option';
import { Typewriter } from '../typewriters/typewriter';
import { createModelClass } from '@rawmodel/core';
import { CommandResolver, ErrorCode } from '../types';
import { ValidationError } from '../errors/validation';
import { RuntimeError } from '../errors/runtime';

/**
 * Command recipe interface.
 */
export interface CommandRecipe<Context> {

  /**
   * Command name.
   */
  name?: string;

  /**
   * Command description.
   */
  description?: string;

  /**
   * Command summary.
   */
  summary?: string;

  /**
   * List of command options.
   */
  options?: Option[] | OptionRecipe[];

  /**
   * List of sub commands.
   */
  commands?: Command<Context>[] | CommandRecipe<Context>[];

  /**
   * Command resolver.
   */
  resolver?: CommandResolver;

}

/**
 * Command configuration interface.
 */
export interface CommandConfig<Context> {

  /**
   * Parent command instance.
   */
  parent?: Command<Context>;

  /**
   * Arbitrary context data.
   */
  context?: Context;

  /**
   * Custom printer instance.
   */
  typewriter?: Typewriter;

}

/**
 * Command class.
 */
export class Command<Context = any> {

  /**
   * Command resolver.
   */
  public __config: CommandConfig<Context>;

  /**
   * Command name.
   */
  public name: string;

  /**
   * Command description.
   */
  public description: string;

  /**
   * Command summary.
   */
  public summary: string;

  /**
   * Command options.
   */
  public options: Option[];

  /**
   * Sub commands.
   */
  public commands: Command<Context>[];

  /**
   * Command resolver.
   */
  public resolver: CommandResolver;

  /**
   * Class constructor.
   * @param recipe Command recipe.
   * @param config Command configuration.
   */
  public constructor(recipe?: CommandRecipe<Context>, config?: CommandConfig<Context>) {
    recipe = { ...recipe };

    Object.defineProperty(this, '__config', {
      value: {
        typewriter: new Typewriter(),
        ...config,
      },
      enumerable: false,
    });

    this.name = recipe.name || null;
    this.description = recipe.description || null;
    this.summary = recipe.summary || null;

    this.options = (recipe.options || []).map((option) => {
      return option instanceof Option ? option.clone() : new Option(option);
    });
    this.commands = (recipe.commands || []).map((command) => {
      return command instanceof Command ? command.clone() : new Command(command, config);
    });

    this.resolver = recipe.resolver || (() => null);
  }

  /**
   * Returns command arbitrary context data.
   */
  public getParent(): Command<Context> {
    return this.__config.parent || null;
  }

  /**
   * Returns a list of all parent command instances.
   */
  public getAncestors(): Command<Context>[] {
    const tree  = [];

    let parent = this as any;
    while (true) {
      parent = parent.getParent();
      if (parent) {
        tree.unshift(parent);
      } else {
        break;
      }
    }

    return tree;
  }

  /**
   * Returns command arbitrary context data.
   */
  public getContext(): Context {
    return this.__config.context || null;
  }

  /**
   * Returns command typewriter instance.
   */
  public getTypewriter(): Typewriter {
    return this.__config.typewriter || null;
  }

  /**
   * Performs a command based on the provided command-line arguments. The
   * function expects command-line arguments as `process.argv.slice(2)`.
   * @param args List of command-line arguments.
   */
  public async perform(...args: string[]): Promise<this> {
    await performCommand(this, [...args]);
    return this;
  }

  /**
   * Performs Typewriter's `write` operation for each message.
   * @param messages List of arbitrary messages.
   */
  public write(...messages: string[]): this {
    messages.forEach((message) => {
      this.getTypewriter().write(message);
    });
    return this;
  }

  /**
   * Performs Typewriter's `write` operation for each message end `break` method
   * at the end.
   * @param messages List of arbitrary messages.
   */
  public print(...messages: string[]): this {
    return this.write(...messages).break();
  }

  /**
   * Performs Typewriter's `break` operation.
   */
  public break() {
    this.getTypewriter().break();
    return this;
  }

  /**
   * Updates spinning animation message. It also starts the animation if not
   * already started.
   * @param message Arbitrary spinner label.
   */
  public spin(message: string) {
    this.getTypewriter().spin(message);
    return this;
  }

  /**
   * Returns a new Command instance which is the exact copy of the original.
   * @param recipe Command recipe.
   */
  public clone(recipe?: CommandRecipe<Context>): this {
    return new (this.constructor as any)({
      name: this.name,
      description: this.description,
      summary: this.summary,
      options: this.options,
      commands: this.commands,
      resolver: this.resolver,
      ...recipe,
    }, {
      ...this.__config,
    });
  }

}

/**
 * Loops through command-line arguments until it finds the last command, then
 * performs the command resolver or throws an error.
 * @param command Command to process.
 * @param args List of command-line arguments.
 */
async function performCommand(command: Command<any>, args: string[]) {
  if (!command) {
    throw new RuntimeError(ErrorCode.INVALID_COMMAND);
  } else if (/^-\w|^--\w/.test(args[0]) || args.length === 0) {
    return resolveCommand(command, args);
  } else {
    return performCommand(
      command.commands.find((c) => c.name === args[0]),
      args.slice(1),
    );
  }
}

/**
 * Executes command resolver.
 * @param command Command to process.
 * @param args List of command-line arguments.
 */
async function resolveCommand(command: Command<any>, args: string[]) {
  const tail = readTail(args);

  const options = await Promise.resolve().then(() => {
    return readOptions(command, args);
  }).then((data) => {
    return sanitizeOptions(command, data);
  });

  return command.resolver.call(command, { options, tail });
}

/**
 * Returns options object with loaded values that are present among the
 * provided command-line arguments.
 * @param command Command to process.
 * @param args List of command-line arguments.
 */
function readOptions(command: Command<any>, args: string[]): {[key: string]: any} {
  const data = {};

  args = args.indexOf('--') >= 0 ? args.slice(0, args.indexOf('--')) : args; // remove tail

  command.options.forEach(({ name, alias }) => {
    let value = readOptionValueByName(name, args);
    if (typeof value === 'undefined') {
      value = readOptionValueByAlias(alias, args);
    }
    if (typeof value !== 'undefined') {
      data[name] = value;
    }
  });

  return data;
}

/**
 * Validates command line options then returns serialized options object or
 * throws when the first property validation fails.
 * @param command Command to process.
 * @param data Options data object.
 */
async function sanitizeOptions(command: Command<any>, data: {[key: string]: any}): Promise<{[key: string]: any}> {
  const Model = createModelClass(command.options);
  const model = new Model(data);
  try {
    await model.validate();
    return model.serialize();
  } catch (e) {
    await model.handle(e);
    throw new ValidationError(model);
  }
}

/**
 * Reads option value by option name from a list of command-line arguments.
 * @param name Option name.
 * @param args List of command-line arguments.
 */
function readOptionValueByName(name: string, args: string[]) {
  const item = args.find((a) => a === `--${name}` || a.indexOf(`--${name}=`) === 0);
  return item ? item.split('=', 2)[1] : undefined;
}

/**
 * Reads option value by option alias from a list of command-line arguments.
 * @param alias Option alias.
 * @param args List of command-line arguments.
 */
function readOptionValueByAlias(alias: string, args: string[]) {
  const index = alias ? args.indexOf(`-${alias}`) : -1;
  if (index >= 0) {
    const value = args[index + 1];
    return /^-\w|^--\w/.test(value) ? null : value;
  } else {
    return undefined;
  }
}

/**
 * Reads command-line tail (string defined after `--`).
 * @param args List of command-line arguments.
 */
function readTail(args: string[]) {
  const index = args.indexOf('--');
  return index >= 0 ? args.slice(index + 1).join(' ') : null;
}
