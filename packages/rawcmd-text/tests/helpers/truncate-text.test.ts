import { Spec } from '@hayspec/spec';
import { trucateText } from '../../src';

const spec = new Spec();

spec.test('passes through on invalid parameters', (ctx) => {
  ctx.is(trucateText(null, null, null), null);
  ctx.is(trucateText(undefined, null, null), undefined);
  ctx.is(trucateText('foo', null, null), 'foo');
});

spec.test('shortens to allowed string length', (ctx) => {
  ctx.is(trucateText('foo', null, null), 'foo');
  ctx.is(trucateText('This is \u001b[32ma lon', 9, null), 'This is \u001b[32ma');
  ctx.is(trucateText('This is \u001b[32ma long 大利 string', 20, '!'), 'This is \u001b[32ma long 大利!');
});

export default spec;
