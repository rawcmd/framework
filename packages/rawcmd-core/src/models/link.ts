/**
 * Link data type.
 */
export type LinkData = (
  Link
  | LinkRecipe
  | (() => (Link | LinkRecipe))
);

/**
 * Command link interface.
 */
export interface LinkRecipe {

  /**
   * Link name.
   */
  name: string;

  /**
   * Link description.
   */
  url?: string;

}

/**
 * Command link model.
 */
export class Link {

  /**
   * Link name.
   */
  public name: string;

  /**
   * Link url.
   */
  public url: string;

  /**
   * Class constructor.
   * @param recipe Command link recipe.
   */
  public constructor(recipe?: LinkRecipe) {
    recipe = { ...recipe };
    this.name = recipe.name || null;
    this.url = recipe.url || null;
}

  /**
   * Returns a new Link instance which is the exact copy of the original.
   * @param recipe Command link recipe.
   */
  public clone(recipe?: LinkRecipe): this {
    return new (this.constructor as any)({
      name: this.name,
      url: this.url,
      ...recipe,
    });
  }

}
