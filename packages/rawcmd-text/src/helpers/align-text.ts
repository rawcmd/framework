import { isNumber, isInfinite, isString } from '@rawcmd/utils';
import { wcwidth, TextAlign, stripAnsi } from '..';

/**
 * Adds spaces to the provided `text` based on the provided text `width` and
 * alignement type.
 * @param text Arbitrary text.
 * @param width Maximal text size.
 * @param simbol Truncation simbol.
 */
export function alignText(text: string, width: number, align: TextAlign) {

  if (!isString(text) || !isNumber(width) || isInfinite(width) || width < 0 || !align) {
    return text;
  }

  const size = width - wcwidth(stripAnsi(text));

  if (align === TextAlign.RIGHT) {
    return `${' '.repeat(size)}${text}`;
  } else if (align === TextAlign.CENTER) {
    return `${' '.repeat(Math.ceil(size / 2))}${text}${' '.repeat(Math.floor(size / 2))}`;
  } else if (align === TextAlign.LEFT) {
    return `${text}${' '.repeat(size)}`;
  }
}
