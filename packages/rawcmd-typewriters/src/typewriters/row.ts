import { EOL, alignText, wrapText, trucateText, repairAnsi, TextAlign } from '@rawcmd/text';
import { toArray, toString } from '@rawcmd/utils';

/**
 * Row typewriter configuration options.
 */
export interface RowTypewriterOptions {
  separatorSymbol?: string;
  truncationSymbol?: string;
}

/**
 * Row column configuration options.
 */
export interface ColumnRowTypewriterOptions {
  index: number;
  width?: number;
  textLength?: number;
  textWrap?: boolean;
  truncateText?: boolean;
  textAlign?: TextAlign;
}

/**
 * Row typewriter data type.
 */
export type RowTypewriterData = any[];

/**
 * Returns a typewriter function which converts the provided `data` into a
 * string representing a row with one or more columns.
 * NOTE: This method supports multibyte characters.
 * @param columns List of column related configuration options.
 * @param options Row related configuration options.
 */
export function rowTypewriter(columns?: ColumnRowTypewriterOptions[], options?: RowTypewriterOptions) {
  columns = columns || [];

  options = {
    separatorSymbol: ' ',
    truncationSymbol: '…',
    ...options,
  };

  return (data: RowTypewriterData) => {

    data = (data || []).map((value) => { // make sure every data item is a string
      return toString(value) || '';
    });

    const config = data.map((value, index) => { // build configuration for each column
      return {
        index,
        width: Infinity,
        textLength: Infinity,
        textWrap: true,
        textAlign: TextAlign.LEFT,
        ...columns.find((column) => column.index === index),
      };
    });

    const grid = data.map((text, index) => { // build data rows for each column
      const { truncationSymbol } = options;
      const { textLength } = config[index];
      return trucateText(text, textLength, truncationSymbol) || ''; // shorten text to allowed length
    }).map((text, index) => {
      const { width, textWrap } = config[index];
      return toArray(textWrap ? wrapText(text, width) : text); // split column text into rows based on allowed column width
    }).map((rows, index) => {
      const { truncationSymbol } = options;
      const { width } = config[index];
      return rows.map((row) => {
        return trucateText(row, width, truncationSymbol); // shorten text of each column line (could be a word which is longer then allowed column width)
      });
    });

    const size = [ // calculate grid dimension
      data.length,
      Math.max(...grid.map((rows) => rows.length)),
    ];

    const output = grid.map((rows) => { // build final output structure
      return repairAnsi(...rows);
    }).map((rows, index) => { // build final output structure
      return rows.concat(
        ...Array(size[1] - rows.length).fill(' '), // make sure all columns have the same number of rows
      ).map((row) => {
        const { width, textAlign } = config[index];
        return alignText(row, width, textAlign); // align each column data by adding spaces
      });
    }).reduce((r, a) => { // transpose data by columns to rows and rows to collumns
      return a.map((v, i) => [...(r[i] || []), v]) as any;
    }, []).map((rows) => { // merge parts into string
      return rows.join(options.separatorSymbol || '');
    });

    return output.length ? output.join(EOL) + EOL : ''; // always return value
  };
}
