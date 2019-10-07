import { Spec } from '@hayspec/spec';
import { stripAnsi } from '../../src';

const spec = new Spec();

spec.test('passes through on invalid parameters', (ctx) => {
  ctx.deepEqual(stripAnsi(null), null);
  ctx.deepEqual(stripAnsi(undefined), undefined);
});

spec.test('removes ANSI characters from a string', (ctx) => {
  ctx.is(
    stripAnsi('This is \u001b[32ma long'),
    'This is a long',
  );
});

export default spec;
