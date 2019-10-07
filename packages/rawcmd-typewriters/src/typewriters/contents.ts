import { EOL } from '@rawcmd/core';
import { isArray } from '@rawcmd/utils';
import { textTypewriter } from './text';
import { rowTypewriter } from './row';

/**
 * Table of contents typewriter options interface.
 */
export interface ContentsTypewriterOptions {

  /**
   * Dotted padding size.
   */
  paddingWidth?: number;

  /**
   * Allowed horizontal width.
   */
  totalWidth?: number;

}

/**
 * Returns a function which builds an arbitrary table of contents string with
 * names and decriptions.
 */
export function contentsTypewriter(options?: ContentsTypewriterOptions) {

  options = {
    paddingWidth: 5,
    totalWidth: 80,
    ...options,
  };

  const writeDot = textTypewriter({
    dim: true,
  });

  return (lines: string[][]) => {

    if (!isArray(lines) || lines.length <= 0) {
      return '';
    }

    const nameSize = Math.max(
      ...lines.map((line) => line[0].length),
    );

    const bodyTypewriter = rowTypewriter([
      {
        index: 0,
        width: nameSize + options.paddingWidth + 1,
      },
      {
        index: 1,
        width: options.totalWidth - nameSize - options.paddingWidth - 1,
      },
    ]);

    const dotOutput = writeDot('.');
    const bodyOutput = lines.map((line) => {
      return bodyTypewriter([
        `${line[0]} ${dotOutput.repeat(nameSize - line[0].length + options.paddingWidth)}`,
        line[1],
      ]);
    }).join(EOL);

    return bodyOutput;
  };
}
