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

spec.test('returns `true` when spinner is started', async (ctx) => {
  const spinner = ctx.get('spinner');
  ctx.false(spinner.isStarted());
  spinner.start();
  ctx.true(spinner.isStarted());
});

export default spec;
