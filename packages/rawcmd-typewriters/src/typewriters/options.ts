import { Command, EOL } from '@rawcmd/core';
import { contentsTypewriter, ContentsTypewriterOptions } from './contents';
import { titleTypewriter } from './title';

/**
 * Command options typewriter options interface.
 */
export interface OptionsTypewriterOptions extends ContentsTypewriterOptions {

  /**
   * Summary section title.
   */
  title?: string;

}

/**
 * Returns a function which builds a string representing a list of all available
 * command options with descriptions.
 * @param options Command options typewriter options.
 */
export function optionsTypewriter(options?: OptionsTypewriterOptions) {

  options = {
    title: 'Options',
    ...options,
  };

  const writeTitle = titleTypewriter(options);
  const writeBody = contentsTypewriter(options);

  return (command: Command) => {

    if (!command || command.options.length <= 0) {
      return '';
    }

    const data = command.options.filter((o) => {
      return !!o.name && !!o.description;
    }).map((o) => {
      return [
        [
          o.name ? `--${o.name}` : null,
          o.alias ? `-${o.alias}` : null,
        ].filter((v) => !!v).join(', '),
        o.description,
      ];
    });

    const titleOutput = writeTitle(options.title);
    const bodyOutput = writeBody(data);

    return [titleOutput, bodyOutput].filter((o) => !!o).join(EOL);
  };
}
