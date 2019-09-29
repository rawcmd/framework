import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
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

spec.test('writes chunks', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const typewriter = ctx.get('typewriter');
  typewriter.write('ab');
  typewriter.write('cd');
  ctx.is(streamlet.toString(), 'abcd');
});

spec.test('converts EOLs to valid EOL', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  const typewriter = ctx.get('typewriter');
  typewriter.write('a\nb\r\nc');
  ctx.is(streamlet.toString(), `a${EOL}b${EOL}c`);
});

export default spec;
