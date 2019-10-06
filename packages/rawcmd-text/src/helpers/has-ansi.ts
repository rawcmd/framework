import { ANSI_PATTERN } from '../constants';

/**
 * Returns true if the text contains ANSI character.
 * @param text Arbitrary text.
 */
export function hasAnsi(text: string): boolean {
  return new RegExp(ANSI_PATTERN).test(text);
}
