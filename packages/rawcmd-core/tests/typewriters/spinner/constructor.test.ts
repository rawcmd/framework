import { Spec } from '@hayspec/spec';
import { Spinner, MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
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

spec.test('supports custom message resolver', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const spinner = new Spinner<{
    code: number;
    message: string;
  }>({
    streamlet,
    resolver(message) {
      return `${this.getChar()}-${message.code}-${message.message}`;
    },
  });
  spinner.start();
  spinner.write({ code: 100, message: 'foo' });
  ctx.is(streamlet.toString(), `⠋-100-foo`);
  spinner.stop();
});

export default spec;
