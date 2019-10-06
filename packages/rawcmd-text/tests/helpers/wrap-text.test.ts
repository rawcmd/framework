import { Spec } from '@hayspec/spec';
import { wrapText } from '../../src';

const spec = new Spec();

spec.test('passes through on invalid parameters', (ctx) => {
  ctx.is(wrapText(null, null), null);
  ctx.is(wrapText(undefined, null), undefined);
  ctx.is(wrapText('foo', null), 'foo');
  ctx.is(wrapText('火1', null), '火1'); // wide characters
  ctx.is(wrapText('fo\u001b[0mo', null), 'fo\u001b[0mo'); // ansi characters
});

spec.test('splits string into multiple strings', (ctx) => {
  ctx.deepEqual(wrapText('This is \u001b[32ma long 火腿 string sam火ple mor\u001b[39mda nek腿aj malega\nspet\nse pove.', 10), [
    'This is \u001b[32ma',
    'long 火腿',
    'string',
    'sam火ple',
    'mor\u001b[39mda',
    'nek腿aj',
    'malega',
    'spet',
    'se pove.',
  ]);
});

export default spec;
