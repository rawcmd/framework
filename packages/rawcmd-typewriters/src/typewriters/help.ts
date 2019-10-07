import { Command, EOL } from '@rawcmd/core';
import { commandsTypewriter, optionsTypewriter, summaryTypewriter,
  usageTypewriter, linksTypewriter } from '..';

/**
 * Help typewriter options interface.
 */
export interface HelpTypewriterOptions {

  /**
   * Allowed horizontal width.
   */
  totalWidth?: number;

}

/**
 * Returns a function which builds a string describing command abilities and
 * usage information.
 * @param options Help typewriter options.
 */
export function helpTypewriter(options?: HelpTypewriterOptions) {

  const writeSummary = summaryTypewriter(options);
  const writeUsage = usageTypewriter(options);
  const writeCommands = commandsTypewriter(options);
  const writeOptions = optionsTypewriter(options);
  const writeLinks = linksTypewriter(options);

  return (command: Command) => {
    return [
      writeSummary(command),
      writeUsage(command),
      writeCommands(command),
      writeOptions(command),
      writeLinks(command),
    ].filter((v) => !!v).join(EOL + EOL);
  };
}
