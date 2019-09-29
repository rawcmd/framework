import { Spec } from '@hayspec/spec';
import { Typewriter, MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
});

spec.test('supports custom message resolver', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const spinner = new Typewriter<{
    code: number;
    message: string;
  }>({
    streamlet,
    resolver(message) {
      return `${message.code}-${message.message}`;
    },
  });
  spinner.write({ code: 100, message: 'foo' });
  ctx.is(streamlet.toString(), `100-foo`);
});

export default spec;
