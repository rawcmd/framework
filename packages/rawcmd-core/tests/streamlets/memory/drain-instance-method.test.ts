import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
import { MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
});

spec.test('removes all buffered data', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  streamlet.write('a');
  streamlet.write(EOL);
  streamlet.write('b');
  streamlet.drain();
  ctx.is(streamlet.toString(), '');
});

export default spec;
