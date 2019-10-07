import { Command, EOL } from '@rawcmd/core';
import { contentsTypewriter, ContentsTypewriterOptions } from './contents';
import { titleTypewriter } from './title';

/**
 * Command sub commands typewriter options interface.
 */
export interface CommandsTypewriterOptions extends ContentsTypewriterOptions {

  /**
   * Summary section title.
   */
  title?: string;

}

/**
 * Returns a function which builds a string representing a list of all available
 * commands with descriptions.
 * @param options Commands typewriter options.
 */
export function commandsTypewriter(options?: CommandsTypewriterOptions) {

  options = {
    title: 'Commands',
    ...options,
  };

  const writeTitle = titleTypewriter(options);
  const writeBody = contentsTypewriter(options);

  return (command: Command) => {

    if (!command || command.commands.length <= 0) {
      return '';
    }

    const data = command.commands.filter((c) => {
      return !!c.name && !!c.description;
    }).map((c) => {
      return [c.name, c.description];
    });

    const titleOutput = writeTitle(options.title);
    const bodyOutput = writeBody(data);

    return [titleOutput, bodyOutput].filter((o) => !!o).join(EOL);
  };
}
