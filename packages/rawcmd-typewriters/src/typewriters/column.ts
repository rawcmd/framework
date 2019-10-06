import { EOL } from 'os';
import { toString } from '@rawcmd/utils';
import * as wcwidth from '@slimio/wcwidth';

/**
 * Row typewriter configuration options.
 */
export interface RowTypewriterOptions {
  separator?: string;
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
  truncationSymbol?: string;
  textAlign?: string;
}

/**
 * Row typewriter data type.
 */
export type RowTypewriterData = any[];

/**
 * ANSI `start` and `stop` style codes.
 */
const ANSI_CODES = {
  reset: ['\u001b[0m', '\u001b[0m'],
  bold: ['\u001b[1m', '\u001b[22m'],
  dim: ['\u001b[2m', '\u001b[22m'],
  italic: ['\u001b[3m', '\u001b[23m'],
  underline: ['\u001b[4m', '\u001b[24m'],
  inverse: ['\u001b[7m', '\u001b[27m'],
  hidden: ['\u001b[8m', '\u001b[28m'],
  black: ['\u001b[30m', '\u001b[39m'],
  red: ['\u001b[31m', '\u001b[39m'],
  green: ['\u001b[32m', '\u001b[39m'],
  yellow: ['\u001b[33m', '\u001b[39m'],
  blue: ['\u001b[34m', '\u001b[39m'],
  magenta: ['\u001b[35m', '\u001b[39m'],
  cyan: ['\u001b[36m', '\u001b[39m'],
  white: ['\u001b[37m', '\u001b[39m'],
  bgblack: ['\u001b[40m', '\u001b[49m'],
  bgred: ['\u001b[41m', '\u001b[49m'],
  bggreen: ['\u001b[42m', '\u001b[49m'],
  bgyellow: ['\u001b[43m', '\u001b[49m'],
  bgblue: ['\u001b[44m', '\u001b[49m'],
  bgmagenta: ['\u001b[45m', '\u001b[49m'],
  bgcyan: ['\u001b[46m', '\u001b[49m'],
  bgwhite: ['\u001b[47m', '\u001b[49m'],
};

/**
 * ANSI regular expression pattern.
 */
const ANSI_PATTERN = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|');

/**
 * Returns an array with opening and closing ANSI pairs that match the provided
 * `simbol` an `null` if the simbol does not match supported codes.
 * @param simbol Opening or closing ANSI character.
 */
function matchAnsiPairs(simbol: string) {
  const pairs = Object.values(ANSI_CODES).filter((pair) => pair.indexOf(simbol) !== -1);
  return pairs.length ? pairs : null;
}

/**
 * Returns true if the text contains ANSI character.
 * @param text Arbitrary text.
 */
function hasAnsi(text: string): boolean {
  return new RegExp(ANSI_PATTERN).test(text);
}

/**
 * Removes all ANSI characters from the provided `text`.
 * @param text Arbitrary text.
 */
function stripAnsi(text: string) {
  return text.replace(new RegExp(ANSI_PATTERN, 'g'), '');
}

/**
 * Splits the `text` into an array of strings and ANSI codes. When the ANSI code
 * is found, the text is splitted and the ANSI code is added as a stendalone
 * item in the array.
 * @param text Arbitrary text.
 */
function splitAnsi(text: string): string[] {
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

/**
 * Splits the provided `text` into text lines.
 * NOTE: This method supports multibyte and ANSI characters.
 * @param text Arbitrary text.
 * @param width Allowed line width.
 */
function wrapText(text: string, width: number): string[] {
  const result = [];

  text.split(/\r?\n/).forEach((line) => {
    let words = [];
    let length = 0;

    line.split(/\s/g).forEach((word) => {
      const str = stripAnsi(word);

      if (length + wcwidth(word) > width && words.length) {
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

  return result.map((line) => line.replace(/\r?\n/g, EOL));
}

/**
 * Shortens the provided `text` to required `size`, with a truncation `simbol`
 * at the end if the text is longer then allowed `size`.
 * NOTE: This method supports multibyte characters.
 * @param text Arbitrary text.
 * @param width Maximal text size.
 * @param simbol Truncation simbol.
 */
function trucateText(text: string, width: number, simbol: string): string {
  if (wcwidth(stripAnsi(text)) <= width) {
    return text;
  }

  const chunks = splitAnsi(text).map((chunk) => {
    return hasAnsi(chunk) ? [chunk] : chunk.split('');
  }).reduce((a, b) => {
    return a.concat(b);
  }, []);

  width = width - wcwidth(stripAnsi(simbol));
  width = width < 0 ? 0 : width;

  const line = [];
  const ansis = [];
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

/**
 * Adds spaces to the provided `text` based on the provided text `width` and
 * alignement type.
 * @param text Arbitrary text.
 * @param width Maximal text size.
 * @param simbol Truncation simbol.
 */
function alignText(text: string, width: number, align: string) {
  const size = width - wcwidth(stripAnsi(text));

  if (align === 'right') {
    return `${' '.repeat(size)}${text}`;
  } else if (align === 'center') {
    return `${' '.repeat(Math.ceil(size / 2))}${text}${' '.repeat(Math.floor(size / 2))}`;
  } else if (align === 'left') {
    return `${text}${' '.repeat(size)}`;
  }
}

/**
 * Prepends and appends missing opening and closing ANSI characters.
 * @param rows List of arbitrary text rows of a column.
 */
function repairAnsi(...rows: string[]) {
  const ansis = [];

  return rows.map((text) => {
    const chunks = splitAnsi(text);
    const result = [];

    ansis.forEach((ansi) => {
      result.push(ansi);
    });

    chunks.forEach((chunk) => {
      if (hasAnsi(chunk)) {
        (matchAnsiPairs(chunk) || []).forEach((pair) => {
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
      (matchAnsiPairs(ansi) || []).forEach((pair) => {
        result.push(pair[1]);
      });
    });

    return result.join('');
  });
}

/**
 * Returns a typewriter function which converts the provided `data` into a
 * string representing a row with one or more columns.
 * NOTE: This method supports multibyte characters.
 * @param columns List of column related configuration options.
 * @param options Row related configuration options.
 */
function rowTypewriter(columns?: ColumnRowTypewriterOptions[], options?: RowTypewriterOptions) {
  columns = columns || [];

  options = {
    separator: ' ',
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
        textAlign: 'left',
        truncationSymbol: '…',
        ...columns.find((column) => column.index === index),
      };
    });

    const grid = data.map((text, index) => { // build data rows for each column
      const { textLength, truncationSymbol } = config[index];
      return trucateText(text, textLength, truncationSymbol); // shorten text to allowed length
    }).map((text, index) => {
      const { width, textWrap } = config[index];
      return textWrap ? wrapText(text, width) : [text]; // split column text into rows based on allowed column width
    }).map((rows, index) => {
      const { width, truncationSymbol } = config[index];
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
        ...Array(size[1] - rows.length).fill(''), // make sure all columns have the same number of rows
      ).map((row) => {
        const { width, textAlign } = config[index];
        return alignText(row, width, textAlign); // align each column data by adding spaces
      });
    }).reduce((r, a) => { // transpose data by columns to rows and rows to collumns
      return a.map((v, i) => [...(r[i] || []), v]) as any;
    }, []) as string[][];

    return output.map((rows) => { // merge parts into string
      return rows.join(options.separator || '');
    }).join(EOL);
  };
}

/**
 * RUN EXAMPLE!
 */
console.log(
  rowTypewriter([
    {
      index: 0,
      width: 15,
      textAlign: 'center',
    },
    {
      index: 1,
      width: 9,
    },
    {
      index: 2,
      width: 15,
      textLength: 15,
      textWrap: false,
    },
    {
      index: 3,
      width: 15,
      textAlign: 'right',
    },
    {
      index: 4,
      width: 15,
    },
  ], {
    separator: ' | ',
  })([
    'This is \u001b[32ma long string sample mor\u001b[39mda nekaj malega\nspet\nse pove.',
    '意大利粉, 火腿, 意大利干酪',
    'And this is even longer string which should break into multiple lines.',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  ]),
);
