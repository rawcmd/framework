import { Model } from '@rawmodel/core';
import { GenericError } from './generic';

/**
 * Model validation error.
 */
export class ValidationError extends GenericError {

  /**
   * Class constructor.
   * @param model Model instance.
   */
  public constructor(model: Model) {
    super();

    const { code } = model.collectErrors()[0];
    this.message = 'Validation failed.';
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

}
