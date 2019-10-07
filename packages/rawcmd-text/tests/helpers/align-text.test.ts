import { Spec } from '@hayspec/spec';
import { alignText, TextAlign } from '../../src';

const spec = new Spec();

spec.test('passes through on invalid parameters', (ctx) => {
  ctx.is(alignText(null, null, null), null);
  ctx.is(alignText(undefined, null, null), undefined);
  ctx.is(alignText('foo', null, null), 'foo');
  ctx.is(alignText('火1', null, null), '火1'); // wide characters
  ctx.is(alignText('fo\u001b[0mo', null, null), 'fo\u001b[0mo'); // ansi characters
});

spec.test('aligns to left', (ctx) => {
  ctx.is(alignText('foo', 10, TextAlign.LEFT), 'foo       ');
  ctx.is(alignText('火1', 10, TextAlign.LEFT), '火1       '); // wide characters
  ctx.is(alignText('fo\u001b[0mo', 10, TextAlign.LEFT), 'fo\u001b[0mo       '); // ansi characters
});

spec.test('aligns to center', (ctx) => {
  ctx.is(alignText('foo', 10, TextAlign.CENTER), '    foo   '); // ceil to left
  ctx.is(alignText('火1', 10, TextAlign.CENTER), '    火1   '); // wide characters
  ctx.is(alignText('fo\u001b[0mo', 10, TextAlign.CENTER), '    fo\u001b[0mo   '); // ansi characters
});

spec.test('aligns to right', (ctx) => {
  ctx.is(alignText('foo', 10, TextAlign.RIGHT), '       foo');
  ctx.is(alignText('火1', 10, TextAlign.RIGHT), '       火1'); // wide characters
  ctx.is(alignText('fo\u001b[0mo', 10, TextAlign.RIGHT), '       fo\u001b[0mo'); // ansi characters
});

export default spec;
