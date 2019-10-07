/**
 * List of known error codes.
 */
export enum ErrorCode {
  INVALID_COMMAND = 4000000,
  UNEXPECTED_BEHAVIOR = 4000001,
}

/**
 * Command resolver function type.
 */
export type CommandResolver = (p: CommandInput) => any;

/**
 * TTY spinner message resolver.
 */
export type TypewriterResolver = (message: string) => string;

/**
 * Typewriter stream interface.
 */
export interface StreamletBase {
  width: number;
  height: number;
  write(str: string): boolean;
  clearLine(): boolean;
}

/**
 * Error data object interface.
 */
export interface ErrorData {
  code: number;
  message: string;
  name: string;
}

/**
 * Command resolver input data interface.
 */
export interface CommandInput {
  options: {[name: string]: any};
  tail: string;
}
