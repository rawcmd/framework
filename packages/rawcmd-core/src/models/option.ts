import { SimpleResolver, ParserRecipe, ValidatorRecipe, HandlerRecipe } from '@rawmodel/core';

/**
 * Command option interface.
 */
export interface OptionRecipe {

  /**
   * Option name.
   */
  name: string;

  /**
   * Option alias.
   */
  alias?: string;

  /**
   * Option description.
   */
  description?: string;

  /**
   * Option custom getter.
   */
  getter?: SimpleResolver;

  /**
   * Option custom setter.
   */
  setter?: SimpleResolver;

  /**
   * Option value parser.
   */
  parser?: ParserRecipe;

  /**
   * Option default value.
   */
  defaultValue?: any | SimpleResolver;

  /**
   * Option empty value.
   */
  emptyValue?: any | SimpleResolver;

  /**
   * Option value validators.
   */
  validators?: ValidatorRecipe[];

  /**
   * Option error handlers.
   */
  handlers?: HandlerRecipe[];

}

/**
 * Command option model.
 */
export class Option {

  /**
   * Option name.
   */
  public name: string;

  /**
   * Option alias.
   */
  public alias: string;

  /**
   * Option description.
   */
  public description: string;

  /**
   * Option custom setter.
   */
  public setter: SimpleResolver;

  /**
   * Option custom getter.
   */
  public getter: SimpleResolver;

  /**
   * Option value parser.
   */
  public parser: ParserRecipe;

  /**
   * Option default value.
   */
  public defaultValue: any | SimpleResolver;

  /**
   * Option empty value.
   */
  public emptyValue: any | SimpleResolver;

  /**
   * Option empty value.
   */
  public validators: ValidatorRecipe[];

  /**
   * Option error handlers.
   */
  public handlers: HandlerRecipe[];

  /**
   * Class constructor.
   * @param recipe Command option recipe.
   */
  public constructor(recipe?: OptionRecipe) {
    recipe = { ...recipe };
    this.name = recipe.name || null;
    this.alias = recipe.alias || null;
    this.description = recipe.description || null;
    this.setter = recipe.setter || null;
    this.getter = recipe.getter || null;
    this.parser = recipe.parser || null;
    this.defaultValue = recipe.defaultValue || null;
    this.emptyValue = recipe.emptyValue || null;
    this.validators = [...(recipe.validators || [])];
    this.handlers = [...(recipe.handlers || [])];
}

  /**
   * Returns a new Option instance which is the exact copy of the original.
   * @param recipe Command option recipe.
   */
  public clone(recipe?: OptionRecipe): this {
    return new (this.constructor as any)({
      name: this.name,
      alias: this.alias,
      description: this.description,
      setter: this.setter,
      getter: this.getter,
      parser: this.parser,
      defaultValue: this.defaultValue,
      emptyValue: this.emptyValue,
      validators: this.validators,
      handlers: this.handlers,
      ...recipe,
    });
  }

}
