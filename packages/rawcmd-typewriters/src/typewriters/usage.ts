import { Command, EOL } from '@rawcmd/core';
import { titleTypewriter } from './title';
import { rowTypewriter } from './row';

/**
 * Command usage typewriter options interface.
 */
export interface UsageTypewriterOptions {

  /**
   * Usage section title.
   */
  title?: string;

  /**
   * Allowed horizontal width.
   */
  totalWidth?: number;

}

/**
 * Returns a function which builds a string showing how the command should be
 * used with examples.
 * @param options Commands typewriter options.
 */
export function usageTypewriter(options?: UsageTypewriterOptions) {

  options = {
    title: 'Usage',
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

    if (!command) {
      return '';
    }

    const lines = [
      [
        '$',
        ...command.getAncestors().map((a) => a.name),
        command.name,
        '<COMMAND>',
      ].filter((v) => !!v).join(' '),
      [
        '$',
        ...command.getAncestors().map((a) => a.name),
        command.name,
        '<OPTION>',
      ].filter((v) => !!v).join(' '),
    ];

    const titleOutput = writeTitle(options.title);
    const bodyOutput = lines.map((line) => {
      return writeBody([line]);
    }).join(EOL);

    return [titleOutput, bodyOutput].filter((o) => !!o).join(EOL);
  };
}
