import { Spec } from '@hayspec/spec';
import * as exp from '../src';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!exp.ANSI_CODES);
  ctx.true(!!exp.ANSI_PATTERN);
  ctx.true(!!exp.EOL);
  ctx.true(!!exp.alignText);
  ctx.true(!!exp.hasAnsi);
  ctx.true(!!exp.findAnsiPairs);
  ctx.true(!!exp.repairAnsi);
  ctx.true(!!exp.sizeText);
  ctx.true(!!exp.splitAnsi);
  ctx.true(!!exp.stripAnsi);
  ctx.true(!!exp.trucateText);
  ctx.true(!!exp.wrapText);
});

export default spec;
