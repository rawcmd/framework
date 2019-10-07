import { isString } from '@rawcmd/utils';
import { ANSI_PATTERN } from '../constants';

/**
 * Splits the `text` into an array of strings and ANSI codes. When the ANSI code
 * is found, the text is splitted and the ANSI code is added as a stendalone
 * item in the array.
 * @param text Arbitrary text.
 */
export function splitAnsi(text: string): string[] {

  if (!isString(text)) {
    return [];
  }

  const parts = text.match(new RegExp(ANSI_PATTERN, 'g')) || [];
  const result = [];
  let offset = 0;
  let ptr = 0;

  for (const part of parts) {
    offset = text.indexOf(part, offset);
    if (ptr !== offset) {
      result.push(text.slice(ptr, offset));
    }
    if (ptr === offset && result.length) {
      result[result.length - 1] += part;
    } else {
      result.push(part);
    }
    ptr = offset + part.length;
  }
  result.push(text.slice(ptr));

  return result.filter((r) => !!r);
}
