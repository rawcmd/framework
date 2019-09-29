import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
import { MemoryStreamlet } from '../../../src';

const spec = new Spec<{
  streamlet: MemoryStreamlet;
}>();

spec.beforeEach((ctx) => {
  ctx.set('streamlet', new MemoryStreamlet());
});

spec.test('writes chunks', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  streamlet.write('a');
  streamlet.write('b');
  streamlet.write('c');
  streamlet.write('d');
  ctx.is(streamlet.toString(), 'abcd');
});

spec.test('converts EOLs to valid EOL', async (ctx) => {
  const streamlet = ctx.get('streamlet');
  streamlet.write('a\nb\r\nc');
  ctx.is(streamlet.toString(), `a${EOL}b${EOL}c`);
});

export default spec;
