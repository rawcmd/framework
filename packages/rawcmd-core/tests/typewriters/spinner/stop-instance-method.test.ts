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
  }).start());
});

spec.afterEach((ctx) => {
  ctx.get('spinner').stop();
});

spec.test('starts animation', async (ctx) => {
  const spinner = ctx.get('spinner');
  ctx.true(spinner.isStarted());
  spinner.stop();
  ctx.false(spinner.isStarted());
});

export default spec;
