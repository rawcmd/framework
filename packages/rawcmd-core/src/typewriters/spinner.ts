import { ConsoleStreamlet } from '../streamlets/console';
import { StreamletBase, TypewriterResolver } from '../types';

/**
 * TTY spinner printer options interface.
 */
export interface SpinnerConfig<Message> {

  /**
   * Animation character sequence.
   */
  chars?: string[];

  /**
   * Message resolver function.
   */
  resolver?: TypewriterResolver<Message>;

  /**
   * Animation speed.
   */
  speed?: number;

  /**
   * Streamlet class instance.
   */
  streamlet?: StreamletBase;

}

/**
 * TTY spinner printer for writing spinner animation messages to streamlets.
 */
export class Spinner<Message = any> {

  /**
   * Animation character sequence.
   */
  protected _chars: string[];

  /**
   * Current animation message.
   */
  protected _message: Message;

  /**
   * Message resolver function.
   */
  protected _resolver: TypewriterResolver<Message>;

  /**
   * Animation speed.
   */
  protected _speed: number;

  /**
   * Streamlet class instance.
   */
  protected _streamlet: StreamletBase;

  /**
   * Animation heartbeat timer.
   */
  protected _timer: any = null;

  /**
   * Class constructor.
   * @param config TTY spinner printer options.
   */
  public constructor(config?: SpinnerConfig<Message>) {
    config = { ...config };

    this._chars = config.chars || ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this._speed = config.speed || 30;
    this._streamlet = config.streamlet || new ConsoleStreamlet();

    this._resolver = config.resolver || function(message) {
      return `${[this.getChar(), message].filter((v) => !!v).join(' ')} `;
    };
  }

  /**
   * Returns `true` if the spinner is running.
   */
  public isStarted(): boolean {
    return !!this._timer;
  }

  /**
   * Returns the current animation character.
   */
  public getChar(): string {
    return this._chars[0];
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
   * Starts the animation.
   */
  public start(): this {
    if (!this._timer) {
      this._timer = setTimeout(this._tick.bind(this), 0);
    }
    return this;
  }

  /**
   * Stops the animation.
   */
  public stop(): this {
    if (this._timer) {
      this._streamlet.clearLine();
      clearTimeout(this._timer);
      this._timer = null;
    }
    return this;
  }

  /**
   * Updates animation label.
   * @param message Arbitrary message.
   */
  public write(message: Message): boolean {
    if (!this.isStarted()) {
      return false;
    }
    this._message = message;
    this._render(); // force repaint
    return true;
  }

  /**
   * Performs animation heartbeat tick.
   */
  protected _tick(): void {
    if (!this._timer) {
      return;
    }
    this._chars.push(this._chars.shift());
    this._render();
    this._timer = setTimeout(this._tick.bind(this), this._speed);
  }

  /**
   * Repaints data of the last streamlet row.
   */
  protected _render(): void {
    this._streamlet.clearLine();
    this._streamlet.write(
      this._resolver.call(this, this._message),
    );
  }

}
