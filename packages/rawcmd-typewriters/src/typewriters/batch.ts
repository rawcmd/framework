import { EOL } from 'os';

/**
 * Batch typewriter configuration options.
 */
export interface BatchTypewriterOptions {
  separator?: string;
}

/**
 * Returns a function which joins list of strings with a separator.
 * @param options Typewriter options.
 */
export function batchTypewriter(options?: BatchTypewriterOptions) {
  options = {
    separator: EOL,
    ...options,
  };
  return (data?: any[]): string => {
    try {
      return data.map((s) => `${s}`).join(options.separator);
    } catch (e) {
      return '';
    }
  };
}
