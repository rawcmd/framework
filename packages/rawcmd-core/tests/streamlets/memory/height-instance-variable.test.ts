import { Spec } from '@hayspec/spec';
import { MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet(100, 200));
});

spec.test('returns screen height', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  ctx.is(streamlet.height, 200);
});

export default spec;
