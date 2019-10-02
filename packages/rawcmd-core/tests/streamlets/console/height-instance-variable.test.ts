import { Spec } from '@hayspec/spec';
import { ConsoleStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: ConsoleStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new ConsoleStreamlet());
});

spec.test('returns screen height', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  ctx.is(streamlet.height, process.stdout.rows);
});

export default spec;
