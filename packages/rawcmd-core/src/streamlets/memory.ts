import { EOL } from 'os';
import { StreamletBase } from '../types';

/**
 * Memory streamlet simulates ConsoleStreamlet class in memory. Use this class
 * when testing your code.
 */
export class MemoryStreamlet implements StreamletBase {

  /**
   * TTY screen width.
   */
  protected _columns: number;

  /**
   * TTY screen height.
   */
  protected _rows: number;

  /**
   * TTY data store.
   */
  protected _buffer = '';

  /**
   * Class constructor.
   * @param columns TTY screen width.
   * @param rows TTY screen height.
   */
  public constructor(columns: number = 0, rows: number = 0) {
    this._columns = columns;
    this._rows = rows;
  }

  /**
   * Returns TTY screen width.
   */
  public get columns(): number {
    return this._columns;
  }

  /**
   * Returns TTY screen height.
   */
  public get rows(): number {
    return this._rows;
  }

  /**
   * Appends message to TTY buffer.
   * @param chunk Arbitrary message.
   */
  public write(chunk: string): boolean {
    this._buffer += (chunk || '').toString().replace(/\r\n|\n/g, EOL);
    return true;
  }

  /**
   * Removes the content of the last written row.
   * @param chunk Arbitrary message.
   */
  public clearLine(): boolean {
    this._buffer = this._buffer.substr(0, this._buffer.lastIndexOf(EOL) + 1);
    return true;
  }

  /**
   * Removes all buffered data.
   */
  public drain() {
    this._buffer = '';
    return true;
  }

  /**
   * Returns complete buffered data.
   */
  public toString(): string {
    return this._buffer;
  }

}
