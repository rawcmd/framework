import { EOL } from 'os';
import { Spinner, SpinnerConfig } from './spinner';
import { ConsoleStreamlet } from '../streamlets/console';
import { StreamletBase, TypewriterResolver } from '../types';

/**
 * Printer class options interface.
 */
export interface TypewriterConfig<Message> {

  /**
   * Message resolver function.
   */
  resolver?: TypewriterResolver<Message>;

  /**
   * Spinner configuration options.
   */
  spinner?: SpinnerConfig<Message>;

  /**
   * Streamlet class instance.
   */
  streamlet?: StreamletBase;

}

/**
 * TTY printer for writing messages to streamlets.
 */
export class Typewriter<Message = any> {

  /**
   * Message resolver function.
   */
  protected _resolver: TypewriterResolver<Message>;

  /**
   * Spinner class instance.
   */
  protected _spinner: Spinner<Message>;

  /**
   * Streamlet class instance.
   */
  protected _streamlet: StreamletBase;

  /**
   * Class constructor.
   * @param options Printer class options.
   */
  public constructor(config?: TypewriterConfig<Message>) {
    config = { ...config };

    this._streamlet = config.streamlet || new ConsoleStreamlet();

    this._resolver = config.resolver || function(message) {
      return message.toString();
    };

    this._spinner = new Spinner<Message>({
      ...config.spinner,
      streamlet: this._streamlet,
    });
  }

  /**
   * Returns TTY screen size as columns and rows.
   */
  public getSize(): [number, number] {
    return [
      this._streamlet.width,
      this._streamlet.height,
    ];
  }

  /**
   * Returns the current streamlet instance.
   */
  public getStreamlet(): StreamletBase {
    return this._streamlet;
  }

  /**
   * Appends row data with new message. It also stops the animation if spinner
   * is started.
   * @param message Arbitrary message.
   */
  public write(message: Message): this {
    this._spinner.stop();
    this._streamlet.write(
      this._resolver.call(this, message),
    );
    return this;
  }

  /**
   * Writes EOL character. It also stops the animation if spinner is started.
   */
  public break(): this {
    this._spinner.stop();
    this._streamlet.write(EOL);
    return this;
  }

  /**
   * Updates spinning animation message. It also starts the animation if not
   * already started.
   * @param message Arbitrary spinner label.
   */
  public spin(message: Message): this {
    this._spinner.start();
    this._spinner.write(message);
    return this;
  }

}
