import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
import { Typewriter, MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
  typewriter: Typewriter;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
  ctx.set('typewriter', new Typewriter({
    streamlet: ctx.get('streamlet'),
  }));
});

spec.test('writes EOL character', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const typewriter = ctx.get('typewriter');
  typewriter.break();
  typewriter.write('a');
  typewriter.break();
  ctx.is(streamlet.toString(), `${EOL}a${EOL}`);
});

export default spec;
