import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
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
  ctx.set('command', new Command({
    typewriter: ctx.get('typewriter'),
  }));
});

spec.test('writes multiple mesages in single line', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const command = ctx.get('command');
  command.write('a', 'bc');
  command.write('d');
  ctx.is(streamlet.toString(), 'abcd');
});

spec.test('converts EOLs to valid EOL', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const command = ctx.get('command');
  command.write('a\nb\r\nc');
  ctx.is(streamlet.toString(), `a${EOL}b${EOL}c`);
});

spec.test('supports custom message format', async (ctx) => {
  interface Message { code: number; message: string; }
  const streamlet = ctx.get('streamlet');
  const command = new Command<Message>({
    typewriter: new Typewriter<Message>({
      streamlet,
      resolver({ code, message }) {
        return `${code}-${message}`;
      },
    }),
  });
  command.write({ code: 100, message: 'foo' });
  ctx.is(streamlet.toString(), `100-foo`);
});

export default spec;
