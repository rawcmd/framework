import { toString } from '@rawcmd/utils';
import { ANSI_CODES, TextBackground, TextColor, TextStyle, repairAnsi } from '@rawcmd/text';

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
  background?: TextBackground;
}

/**
 * Returns a function which renders text (e.g. colorize).
 * @param options Typewriter options.
 */
export function textTypewriter(options?: TextTypewriterOptions) {
  options = { ...options };
  return (value?: any): string => {
    try {
      value = toString(value) || '';
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
    styles.push(ANSI_CODES[TextStyle.RESET]);
  }
  if (options.bold) {
    styles.push(ANSI_CODES[TextStyle.BOLD]);
  }
  if (options.dim) {
    styles.push(ANSI_CODES[TextStyle.DIM]);
  }
  if (options.underline) {
    styles.push(ANSI_CODES[TextStyle.UNDERLINE]);
  }
  if (options.inverse) {
    styles.push(ANSI_CODES[TextStyle.INVERSE]);
  }
  if (options.color) {
    styles.push(ANSI_CODES[options.color]);
  }
  if (options.background) {
    styles.push(ANSI_CODES[options.background]);
  }

  return repairAnsi(`${styles.filter((s) => !!s).map((s) => s[0]).join('')}${value}`).join('');
}
