import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
import { Command, Typewriter, MemoryStreamlet } from '../../../src';

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

spec.test('writes EOL character', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const command = ctx.get('command');
  command.break();
  command.write('a');
  command.break();
  ctx.is(streamlet.toString(), `${EOL}a${EOL}`);
});

export default spec;
