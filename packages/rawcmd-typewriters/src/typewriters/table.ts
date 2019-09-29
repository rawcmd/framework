import { table, getBorderCharacters } from 'table';
import { EOL } from 'os';
import { TextAlign } from '../types';
import { TextTypewriterOptions } from './text';

/**
 * Typewriter configuration options.
 */
export interface TableTypewriterOptions {
  columns?: TableColumnOptions[];
  separator?: string;
}

/**
 * Table column configuration options.
 */
export interface TableColumnOptions extends TextTypewriterOptions {
  index: number;
}

/**
 * Returns a function which renders text (e.g. colorize).
 * @param options Typewriter options.
 */
export function tableTypewriter(options?: TableTypewriterOptions) {
  options = {
    columns: [],
    separator: '  ',
    ...options,
  };
  return (data?: any[][]): string => {
    try {
      return applyForm([...data], options);
    } catch (e) {
      return '';
    }
  };
}

/**
 * Converts the provided string into paragraph.
 * @param data Table data.
 * @param options Typewriter options.
 */
function applyForm(data: any[][], options?: TableTypewriterOptions) {
  const columns = {};
  options.columns.forEach((option) => {
    columns[option.index] = {
      alignment: option.align || TextAlign.LEFT, // track issue https://github.com/gajus/table/issues/104
      wrapWord: true,
      truncate: option.truncate > 0 ? option.truncate : Infinity, // track issue https://github.com/gajus/table/issues/105
      width: option.width > 0 ? option.width : Math.max(...data[option.index]),
    };
  });
  return table(data, {
    columns: { ...columns },
    border: {
      ...getBorderCharacters(`void`),
      bodyJoin: options.separator || '  ',
    },
    drawHorizontalLine() { return false; },
    columnDefault: { paddingLeft: 0, paddingRight: 0 },
  })
  .split(/\r\n|\n/g) // split into lines
  .slice(0, -1) // remove last EOL
  .join(EOL);
}
