import { wcwidth } from '..';
import { stripAnsi } from './strip-ansi';
import { splitAnsi } from './split-ansi';
import { hasAnsi } from './has-ansi';
import { isString, isNumber, isInfinite, toString } from '@rawcmd/utils';

/**
 * Shortens the provided `text` to required `size`, with a truncation `simbol`
 * at the end if the text is longer then allowed `size`.
 * NOTE: This method supports multibyte characters.
 * @param text Arbitrary text.
 * @param width Maximal text size.
 * @param simbol Truncation simbol.
 */
export function trucateText(text: string, width: number, simbol?: string): string {

  if (!isString(text) || !isNumber(width) || isInfinite(width) || width < 0) {
    return text;
  } else if (wcwidth(stripAnsi(text)) <= width) {
    return text;
  }

  simbol = toString(simbol) || '';

  const chunks = splitAnsi(text).map((chunk) => {
    return hasAnsi(chunk) ? [chunk] : chunk.split('');
  }).reduce((a, b) => {
    return a.concat(b);
  }, []);

  width = width - wcwidth(stripAnsi(simbol));
  width = width < 0 ? 0 : width;

  const line = [];
  let length = 0;
  for (const chunk of chunks) {
    const w = wcwidth(stripAnsi(chunk));
    if (length + w > width) {
      break;
    } else if (!hasAnsi(chunk)) {
      length += w;
    }
    line.push(chunk);
  }

  return `${line.join('')}${simbol}`;
}
