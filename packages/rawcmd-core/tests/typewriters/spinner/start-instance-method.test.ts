import { Spec } from '@hayspec/spec';
import { Spinner, MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
  spinner: Spinner;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
  ctx.set('spinner', new Spinner({
    streamlet: ctx.get('streamlet'),
  }));
});

spec.afterEach((ctx) => {
  ctx.get('spinner').stop();
});

spec.test('starts animation', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const spinner = ctx.get('spinner');
  ctx.is(streamlet.toString(), '');
  spinner.start();
  await ctx.sleep(10);
  ctx.is(streamlet.toString(), '⠙ ');
});

export default spec;
