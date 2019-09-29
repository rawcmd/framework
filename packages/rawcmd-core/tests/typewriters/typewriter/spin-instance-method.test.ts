import { Spec } from '@hayspec/spec';
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

spec.test('writes messages in animated row', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const typewriter = ctx.get('typewriter');
  typewriter.spin('foo');
  ctx.is(streamlet.toString(), `⠋ foo `);
  await ctx.sleep(30);
  typewriter.spin('bar');
  ctx.is(streamlet.toString(), `⠙ bar `);
  await ctx.sleep(30);
  typewriter.spin('baz');
  ctx.is(streamlet.toString(), `⠹ baz `);
});

spec.test('animation stops on write', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const typewriter = ctx.get('typewriter');
  typewriter.spin('foo');
  typewriter.write('bar');
  ctx.is(streamlet.toString(), `bar`);
});

export default spec;
