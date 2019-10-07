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

spec.test('does nothing when stopped', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const spinner = ctx.get('spinner');
  spinner.write('foo');
  ctx.is(streamlet.toString(), ``);
});

spec.test('writes messages in animated row', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const spinner = ctx.get('spinner');
  spinner.start();
  spinner.write('foo');
  ctx.is(streamlet.toString(), `⠋ foo `);
  await ctx.sleep(30);
  spinner.write('bar');
  ctx.is(streamlet.toString(), `⠙ bar `);
  await ctx.sleep(30);
  spinner.write('baz');
  ctx.is(streamlet.toString(), `⠹ baz `);
});

spec.test('supports custom characters', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const spinner = new Spinner({
    streamlet,
    chars: ['|', '/', '-', '\\'],
  });
  spinner.start();
  await ctx.sleep(1);
  ctx.is(streamlet.toString(), '/ ');
  spinner.stop();
});

export default spec;
