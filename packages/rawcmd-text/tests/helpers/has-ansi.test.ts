import { Spec } from '@hayspec/spec';
import { hasAnsi } from '../../src';

const spec = new Spec();

spec.test('matches ANSI characters', (ctx) => {
  ctx.false(hasAnsi(null));
  ctx.false(hasAnsi(undefined));
  ctx.false(hasAnsi(''));
  ctx.false(hasAnsi('foo'));
  ctx.true(hasAnsi('fo\u001b[3mo'));
});

export default spec;
