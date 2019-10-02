import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
import { Command, Typewriter, MemoryStreamlet } from '../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
  typewriter: Typewriter;
  command: Command;
}>();

spec.test('returns parent command instance', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const parent = new Command({});
  const command = new Command({}, { parent });
  ctx.is(command.getParent(), parent);
});

export default spec;
