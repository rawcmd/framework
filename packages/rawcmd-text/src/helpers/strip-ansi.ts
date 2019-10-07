import { isString } from '@rawcmd/utils';
import { ANSI_PATTERN } from '../constants';

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
