import { ANSI_PATTERN } from '../constants';
import { isString } from 'util';

/**
 * Removes all ANSI characters from the provided `text`.
 * @param text Arbitrary text.
 */
export function stripAnsi(text: string) {

  if (!isString(text)) {
    return text;
  }

  return text.replace(new RegExp(ANSI_PATTERN, 'g'), '');
}
