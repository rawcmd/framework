import { isString } from '@rawcmd/utils';
import { hasAnsi } from './has-ansi';
import { splitAnsi } from './split-ansi';
import { findAnsiPairs } from './find-ansi-pairs';

/**
 * Prepends and appends missing opening and closing ANSI characters.
 * @param rows List of arbitrary text rows of a column.
 */
export function repairAnsi(...rows: string[]) {
  const ansis = [];

  return rows.map((text) => {

    if (!isString(text)) {
      return text;
    }

    const chunks = splitAnsi(text);
    const result = [];

    ansis.forEach((ansi) => {
      result.push(ansi);
    });
    chunks.forEach((chunk) => {
      if (hasAnsi(chunk)) {
        (findAnsiPairs(chunk) || []).forEach((pair) => {
          if (pair[0] === chunk) {
            ansis.push(pair[0]);
          } else if (pair[1] === chunk) {
            const index = ansis.indexOf(pair[0]);
            if (index !== -1) {
              ansis.splice(index, 1);
            }
          }
        });
      }
      result.push(chunk);
    });
    ansis.forEach((ansi) => {
      (findAnsiPairs(ansi) || []).forEach((pair) => {
        result.push(pair[1]);
      });
    });

    return result.join('');
  });
}
