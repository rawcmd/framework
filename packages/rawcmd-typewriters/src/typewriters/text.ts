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
      value = applyForm(value, options);
      value = applyStyle(value, options);
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
  const styles = [];

  if (options.reset) {
    styles.push('\x1b[0m');
  }
  if (options.bold) {
    styles.push('\x1b[1m');
  }
  if (options.dim) {
    styles.push('\x1b[2m');
  }
  if (options.underline) {
    styles.push('\x1b[4m');
  }
  if (options.inverse) {
    styles.push('\x1b[7m');
  }

  switch (options.color) {
    case TextColor.BLACK:
      styles.push('\x1b[30m');
      break;
    case TextColor.RED:
      styles.push('\x1b[31m');
      break;
    case TextColor.GREEN:
      styles.push('\x1b[32m');
      break;
    case TextColor.YELLOW:
      styles.push('\x1b[33m');
      break;
    case TextColor.BLUE:
      styles.push('\x1b[34m');
      break;
    case TextColor.MAGENTA:
      styles.push('\x1b[35m');
      break;
    case TextColor.CYAN:
      styles.push('\x1b[36m');
      break;
    case TextColor.WHITE:
      styles.push('\x1b[37m');
      break;
  }

  switch (options.background) {
    case TextColor.BLACK:
      styles.push('\x1b[40m');
      break;
    case TextColor.RED:
      styles.push('\x1b[41m');
      break;
    case TextColor.GREEN:
      styles.push('\x1b[42m');
      break;
    case TextColor.YELLOW:
      styles.push('\x1b[43m');
      break;
    case TextColor.BLUE:
      styles.push('\x1b[44m');
      break;
    case TextColor.MAGENTA:
      styles.push('\x1b[45m');
      break;
    case TextColor.CYAN:
      styles.push('\x1b[46m');
      break;
    case TextColor.WHITE:
      styles.push('\x1b[47m');
      break;
  }

  return `${styles.join('')}${value}${styles.length ? '\x1b[0m' : ''}`;
}

/**
 * Converts the provided string into paragraph.
 * @param value String to transform.
 * @param options Typewriter options.
 */
function applyForm(value: string, options?: TextTypewriterOptions): string {
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
