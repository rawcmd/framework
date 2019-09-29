import { ErrorCode, ErrorData } from '../types';

/**
 * General purpose error.
 */
export class GenericError extends Error {

  /**
   * Unique error code number.
   */
  public code: ErrorCode;

  /**
   * Class constructor.
   * @param message Error message.
   * @param code Error code.
   */
  public constructor(message?: string, code?: number) {
    super();

    this.name = this.constructor.name;
    this.message = message || null;
    this.code = code || null;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Returns serialized error object.
   */
  public toJSON(): ErrorData {
    return {
      code: this.code,
      name: this.name,
      message: this.message,
    };
  }

}
