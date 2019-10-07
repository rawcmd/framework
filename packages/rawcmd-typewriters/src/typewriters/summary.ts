import { Command, EOL } from '@rawcmd/core';
import { titleTypewriter } from './title';
import { rowTypewriter } from './row';

/**
 * Command summary typewriter options interface.
 */
export interface SummaryTypewriterOptions {

  /**
   * Summary section title.
   */
  title?: string;

  /**
   * Allowed horizontal width.
   */
  totalWidth?: number;

}

/**
 * Returns a function which builds a string representing command summary text.
 * @param options Command summary typewriter options.
 */
export function summaryTypewriter(options?: SummaryTypewriterOptions) {

  options = {
    title: 'Summary',
    totalWidth: 80,
    ...options,
  };

  const writeTitle = titleTypewriter(options);
  const writeBody = rowTypewriter([
    {
      index: 0,
      width: options.totalWidth,
    },
  ]);

  return (command: Command) => {

    if (!command || !command.summary) {
      return '';
    }

    const data = [command.summary];

    const titleOutput = writeTitle(options.title);
    const bodyOutput = writeBody(data);

    return [titleOutput, bodyOutput].filter((o) => !!o).join(EOL);
  };
}
