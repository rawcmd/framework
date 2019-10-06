import { Spec } from '@hayspec/spec';
import * as exp from '../src';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!exp.EOL);
  ctx.true(!!exp.TextAlign);
  ctx.true(!!exp.TextColor);
  ctx.true(!!exp.textTypewriter);
  ctx.true(!!exp.rowTypewriter);
});

export default spec;
