import { wcwidth } from '..';
import { stripAnsi } from './strip-ansi';
import { EOL } from '../constants';
import { isString, isNumber, isInfinite } from '@rawcmd/utils';

/**
 * Splits the provided `text` into text lines.
 * NOTE: This method supports multibyte and ANSI characters.
 * @param text Arbitrary text.
 * @param width Allowed line width.
 */
export function wrapText(text: string, width: number) {

  if (!isString(text) || !isNumber(width) || isInfinite(width) || width < 0) {
    return text;
  }

  const result = [];

  text.split(/\r?\n/).forEach((line) => {
    let words = [];
    let length = 0;

    line.split(/\s/g).forEach((word) => {
      const str = stripAnsi(word);

      if (length + wcwidth(str) >= width && words.length) {
        result.push(words.join(' '));
        words = [];
        length = 0;
      }
      length += wcwidth(str) + 1;
      words.push(word);
    });

    if (words.length > 0) {
      result.push(words.join(' '));
    }
  });

  return result.map((line) => line.replace(/\r?\n/g, EOL)) as string[];
}
