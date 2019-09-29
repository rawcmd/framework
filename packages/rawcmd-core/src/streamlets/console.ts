import { EOL } from 'os';
import { StreamletBase } from '../types';

/**
 * Console streamlet prints messages directly to TTY console.
 */
export class ConsoleStreamlet implements StreamletBase {

  /**
   * Returns TTY screen width.
   */
  public get columns(): number {
    return process.stdout.columns;
  }

  /**
   * Returns TTY screen height.
   */
  public get rows(): number {
    return process.stdout.rows;
  }

  /**
   * Appends message to TTY buffer.
   * @param chunk Arbitrary message.
   */
  public write(chunk: string): boolean {
    return process.stdout.write(
      (chunk || '').toString().replace(/\r\n|\n/g, EOL),
    );
  }

  /**
   * Removes the content of the last written row.
   * @param chunk Arbitrary message.
   */
  public clearLine(): boolean {
    return (
      !process.stdout.isTTY
      || (
        process.stdout['cursorTo'](0)
        && process.stdout['clearLine'](1)
      )
    );
  }

}
