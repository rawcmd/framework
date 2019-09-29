import { SimpleResolver, ParserRecipe, ValidatorRecipe } from '@rawmodel/core';

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
export type TypewriterResolver<Message> = (message: Message) => string;

/**
 * Typewriter stream interface.
 */
export interface StreamletBase {
  columns: number;
  rows: number;
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
 * Command option interface.
 */
export interface CommandOption {
  name: string;
  alias?: string;
  description?: string;
  set?: SimpleResolver; // @rawmodel
  get?: SimpleResolver; // @rawmodel
  parse?: ParserRecipe; // @rawmodel
  defaultValue?: any | SimpleResolver; // @rawmodel
  emptyValue?: any | SimpleResolver; // @rawmodel
  validate?: ValidatorRecipe[]; // @rawmodel
}

/**
 * Command resolver input data interface.
 */
export interface CommandInput {
  options: {[name: string]: any};
  tail: string;
}
