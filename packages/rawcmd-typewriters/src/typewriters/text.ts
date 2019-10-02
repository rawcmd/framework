import chalk from 'chalk';
import { table, getBorderCharacters } from 'table';
import { EOL } from 'os';
import { TextAlign, TextColor } from '../types';

/**
 * Typewriter configuration options.
 */
export interface TextTypewriterOptions {
  reset?: boolean;
  bold?: boolean;
  dim?: boolean;
  underline?: boolean;
  inverse?: boolean;
  color?: TextColor;
  background?: TextColor;
  align?: TextAlign;
  width?: number;
  truncate?: number;
}

/**
 * Returns a function which renders text (e.g. colorize).
 * @param options Typewriter options.
 */
export function textTypewriter(options?: TextTypewriterOptions) {
  options = { ...options };
  return (value?: any): string => {
    try {
      value = value.toString();
      value = applyStyle(value, options);
      value = applyForm(value, options);
      return value;
    } catch (e) {
      return '';
    }
  };
}

/**
 * Applies ANSI styles to the provided string.
 * @param value String to transform.
 * @param options Typewriter options.
 */
function applyStyle(value: string, options?: TextTypewriterOptions): string {
  let styles = chalk;

  if (options.reset) {
    styles = styles.reset;
  }
  if (options.bold) {
    styles = styles.bold;
  }
  if (options.dim) {
    styles = styles.dim;
  }
  if (options.underline) {
    styles = styles.underline;
  }
  if (options.inverse) {
    styles = styles.inverse;
  }

  switch (options.color) {
    case TextColor.BLACK:
      styles = styles.black;
      break;
    case TextColor.RED:
      styles = styles.red;
      break;
    case TextColor.GREEN:
      styles = styles.green;
      break;
    case TextColor.YELLOW:
      styles = styles.yellow;
      break;
    case TextColor.BLUE:
      styles = styles.blue;
      break;
    case TextColor.MAGENTA:
      styles = styles.magenta;
      break;
    case TextColor.CYAN:
      styles = styles.cyan;
      break;
    case TextColor.WHITE:
      styles = styles.white;
      break;
  }

  switch (options.background) {
    case TextColor.BLACK:
      styles = styles.bgBlack;
      break;
    case TextColor.RED:
      styles = styles.bgRed;
      break;
    case TextColor.GREEN:
      styles = styles.bgGreen;
      break;
    case TextColor.YELLOW:
      styles = styles.bgYellow;
      break;
    case TextColor.BLUE:
      styles = styles.bgBlue;
      break;
    case TextColor.MAGENTA:
      styles = styles.bgMagenta;
      break;
    case TextColor.CYAN:
      styles = styles.bgCyan;
      break;
    case TextColor.WHITE:
      styles = styles.bgWhite;
      break;
  }

  return styles(value);
}

/**
 * Converts the provided string into paragraph.
 * @param value String to transform.
 * @param options Typewriter options.
 */
function applyForm(value: string, options?: TextTypewriterOptions): string {
  if (!options.width) {
    return value;
  }

  const column = {
    alignment: options.align || TextAlign.LEFT,
    wrapWord: true,
    truncate: options.truncate > 0 ? options.truncate : Infinity, // track issue https://github.com/gajus/table/issues/105
    width: options.width > 0 ? options.width : value.length,
  };

  return table([[value]], {
    columns: { 0: column },
    border: getBorderCharacters(`void`),
    drawHorizontalLine() { return false; },
    columnDefault: { paddingLeft: 0, paddingRight: 0 },
  })
  .split(/\r\n|\n/g) // split into lines
  .slice(0, -1) // remove last EOL
  .map((l) => options.width > 0 ? l.substr(0, options.width) : l) // track issue https://github.com/gajus/table/issues/104
  .join(EOL);
}
