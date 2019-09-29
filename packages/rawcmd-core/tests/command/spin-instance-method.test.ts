import { Spec } from '@hayspec/spec';
import { Command, Typewriter, MemoryStreamlet } from '../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
  typewriter: Typewriter;
  command: Command;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
  ctx.set('typewriter', new Typewriter({
    streamlet: ctx.get('streamlet'),
  }));
  ctx.set('command', new Command({}, {
    typewriter: ctx.get('typewriter'),
  }));
});

spec.test('writes messages in animated row', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const command = ctx.get('command');
  command.spin('foo');
  ctx.is(streamlet.toString(), `⠋ foo `);
});

spec.test('supports custom message format', async (ctx) => {
  interface Message { code: number; message: string; }
  const streamlet = ctx.get('streamlet');
  const command = new Command<Message>(null, {
    typewriter: new Typewriter<Message>({
      streamlet,
      spinner: {
        resolver({ code, message }) {
          return `${this.getChar()}-${code}-${message}`;
        },
      },
    }),
  });
  command.spin({ code: 100, message: 'foo' });
  ctx.is(streamlet.toString(), `⠋-100-foo`);
});

export default spec;
