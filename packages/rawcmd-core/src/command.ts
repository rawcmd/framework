import { createModelClass } from '@rawmodel/core';
import { CommandOption, CommandResolver, ErrorCode } from './types';
import { Typewriter } from './typewriters/typewriter';
import { ValidationError } from './errors/validation';
import { RuntimeError } from './errors/runtime';

/**
 * Command class recipe interface.
 */
export interface CommandRecipe<Message, Context> {

  /**
   * Command name.
   */
  name?: string;

  /**
   * Command description.
   */
  description?: string;

  /**
   * List of command options.
   */
  options?: CommandOption[];

  /**
   * List of sub commands.
   */
  commands?: Command<Message, Context>[];

  /**
   * Command resolver.
   */
  resolver?: CommandResolver;

}

/**
 * Command class configuration options interface.
 */
export interface CommandConfig<Context> {

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
export class Command<Message = any, Context = any> {

  /**
   * Command name.
   */
  public name: string;

  /**
   * Command description.
   */
  public description: string;

  /**
   * List of command options.
   */
  public options: CommandOption[];

  /**
   * List of sub commands.
   */
  public commands: Command<Message, Context>[];

  /**
   * Command resolver.
   */
  public resolver: CommandResolver;

  /**
   * Typewriter class instance.
   */
  protected _typewriter: Typewriter<Message>;

  /**
   * Arbitrary context data.
   */
  protected _context: Context;

  /**
   * Class constructor.
   * @param recipe Command class recipe interface.
   * @param config Command class configuration options.
   */
  public constructor(recipe: CommandRecipe<Message, Context>, config?: CommandConfig<Context>) {
    recipe = { ...recipe };
    config = { ...config };
    this.name = recipe.name || null;
    this.description = recipe.description || null;
    this.options = [...recipe.options || []];
    this.commands = [...recipe.commands || []];
    this.resolver = recipe.resolver || function() {};
    this._typewriter = config.typewriter || new Typewriter();
    this._context = typeof config.context !== 'undefined' ? config.context : null;
  }

  /**
   * Returns command arbitrary context data.
   */
  public getContext(): Context {
    return this._context;
  }

  /**
   * Returns command typewriter instance.
   */
  public getTypewriter(): Typewriter<Message> {
    return this._typewriter;
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
  public write(...messages: (Message | any)[]): this {
    messages.forEach((message) => {
      this._typewriter.write(message);
    });
    return this;
  }

  /**
   * Performs Typewriter's `write` operation for each message end `break` method
   * at the end.
   * @param messages List of arbitrary messages.
   */
  public print(...messages: (Message | any)[]): this {
    return this.write(...messages).break();
  }

  /**
   * Performs Typewriter's `break` operation.
   */
  public break() {
    this._typewriter.break();
    return this;
  }

  /**
   * Updates spinning animation message. It also starts the animation if not
   * already started.
   * @param message Arbitrary spinner label.
   */
  public spin(message: Message | any) {
    this._typewriter.spin(message);
    return this;
  }

}

/**
 * Loops through command-line arguments until it finds the last command, then
 * performs the command resolver or throws an error.
 * @param command Command to process.
 * @param args List of command-line arguments.
 */
async function performCommand(command: Command, args: string[]) {
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
async function resolveCommand(command: Command, args: string[]) {
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
function readOptions(command: Command, args: string[]): {[key: string]: any} {
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
async function sanitizeOptions(command: Command, data: {[key: string]: any}): Promise<{[key: string]: any}> {
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
