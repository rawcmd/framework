export { EOL } from 'os';

/**
 * ANSI `start` and `stop` style codes.
 */
export const ANSI_CODES = {
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
export const ANSI_PATTERN = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|');
