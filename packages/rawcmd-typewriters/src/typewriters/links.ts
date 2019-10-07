import { Command, EOL } from '@rawcmd/core';
import { contentsTypewriter, ContentsTypewriterOptions } from './contents';
import { titleTypewriter } from './title';

/**
 * Command links data typewriter options interface.
 */
export interface LinksTypewriterOptions extends ContentsTypewriterOptions {

  /**
   * Support section title.
   */
  title?: string;

}

/**
 * Returns a function which builds a string representing a list of all usefull
 * support references and links.
 * @param options Command references typewriter options.
 */
export function linksTypewriter(options?: LinksTypewriterOptions) {

  options = {
    title: 'Links',
    ...options,
  };

  const writeTitle = titleTypewriter(options);
  const writeBody = contentsTypewriter(options);

  return (command: Command) => {

    if (!command || command.links.length <= 0) {
      return '';
    }

    const data = command.links.filter((l) => {
      return !!l.name && !!l.url;
    }).map((l) => {
      return [l.name, l.url];
    });

    const titleOutput = writeTitle(options.title);
    const bodyOutput = writeBody(data);

    return [titleOutput, bodyOutput].filter((o) => !!o).join(EOL);
  };
}
