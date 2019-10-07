import * as wcwidth2 from '@slimio/wcwidth';
import { isString } from '@rawcmd/utils';
import { stripAnsi } from './strip-ansi';

/**
 * Calculates `text` length with support for wide characters.
 * @param text Arbitrary string.
 * @param ansi Includes ANSI characters when `true`.
 */
export function sizeText(text: string, ansi?: boolean): number {

  if (!isString(text)) {
    return 0;
  }

  return wcwidth2(
    ansi ? text : stripAnsi(text),
  );
}
