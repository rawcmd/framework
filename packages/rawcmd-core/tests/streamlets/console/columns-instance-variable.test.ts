import { Spec } from '@hayspec/spec';
import { ConsoleStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: ConsoleStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new ConsoleStreamlet());
});

spec.test('returns screen width', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  ctx.is(streamlet.columns, process.stdout.columns);
});

export default spec;
