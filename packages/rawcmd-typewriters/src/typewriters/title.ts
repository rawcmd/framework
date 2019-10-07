import { isString } from '@rawcmd/utils';
import { textTypewriter } from './text';
import { rowTypewriter } from './row';

/**
 * Title typewriter options interface.
 */
export interface TitleTypewriterOptions {

  /**
   * Allowed horizontal width.
   */
  totalWidth?: number;
}

/**
 * Returns a function which builds a string representing section title.
 */
export function titleTypewriter(options?: TitleTypewriterOptions) {

  options = {
    totalWidth: 80,
    ...options,
  };

  const writeTitle = textTypewriter({
    bold: true,
  });
  const writeBody = rowTypewriter([
    {
      index: 0,
      width: options.totalWidth,
    },
  ]);

  return (text: string) => {

    if (!isString(text) || !text) {
      return '';
    }

    return writeBody([
      writeTitle(text.toUpperCase()),
    ]);
  };
}
