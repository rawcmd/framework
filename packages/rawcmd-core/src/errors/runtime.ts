import { ErrorCode } from '../types';
import { GenericError } from './generic';

/**
 * Runtime execution error.
 */
export class RuntimeError extends GenericError {

  /**
   * Class constructor.
   * @param code Unique error code number.
   */
  public constructor(code: ErrorCode) {
    super();

    this.message = 'Unexpected runtime error.';
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

}
