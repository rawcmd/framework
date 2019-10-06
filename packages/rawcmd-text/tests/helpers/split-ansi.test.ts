import { Spec } from '@hayspec/spec';
import { splitAnsi } from '../../src';

const spec = new Spec();

spec.test('passes through on invalid parameters', (ctx) => {
  ctx.deepEqual(splitAnsi(null), null);
  ctx.deepEqual(splitAnsi(undefined), undefined);
});

spec.test('splits string on ANSI characters', (ctx) => {
  ctx.deepEqual(
    splitAnsi('This is \u001b[32ma long'),
    ['This is ', '\u001b[32m', 'a long'],
  );
});

export default spec;
