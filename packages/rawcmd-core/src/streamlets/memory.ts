import { EOL } from '@rawcmd/text';
import { toString } from '@rawcmd/utils';
import { StreamletBase } from '../types';

/**
 * Memory streamlet simulates ConsoleStreamlet class in memory. Use this class
 * when testing your code.
 */
export class MemoryStreamlet implements StreamletBase {

  /**
   * TTY screen width as number of columns.
   */
  protected _width: number;

  /**
   * TTY screen height as number of rows.
   */
  protected _height: number;

  /**
   * TTY data store.
   */
  protected _buffer = '';

  /**
   * Class constructor.
   * @param width TTY screen width as number of columns.
   * @param height TTY screen height as number of rows.
   */
  public constructor(width: number = 0, height: number = 0) {
    this._width = width;
    this._height = height;
  }

  /**
   * Returns TTY screen width as number of columns.
   */
  public get width(): number {
    return this._width;
  }

  /**
   * Returns TTY screen height as number of rows.
   */
  public get height(): number {
    return this._height;
  }

  /**
   * Appends message to TTY buffer.
   * @param chunk Arbitrary message.
   */
  public write(chunk: string): boolean {
    this._buffer += (toString(chunk) || '').replace(/\r\n|\n/g, EOL);
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
