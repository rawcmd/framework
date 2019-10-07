import { Spec } from '@hayspec/spec';
import * as exp from '../src';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!exp.isArray);
  ctx.true(!!exp.isFunction);
  ctx.true(!!exp.isInfinite);
  ctx.true(!!exp.isNull);
  ctx.true(!!exp.isNumber);
  ctx.true(!!exp.isString);
  ctx.true(!!exp.isUndefined);
  ctx.true(!!exp.realize);
  ctx.true(!!exp.toArray);
  ctx.true(!!exp.toString);
});

export default spec;
