import { Spec } from '@hayspec/spec';
import * as exp from '../src';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!exp.EOL);
  ctx.true(!!exp.TextAlign);
  ctx.true(!!exp.TextBackground);
  ctx.true(!!exp.TextColor);
  ctx.true(!!exp.TextStyle);
  ctx.true(!!exp.commandsTypewriter);
  ctx.true(!!exp.contentsTypewriter);
  ctx.true(!!exp.helpTypewriter);
  ctx.true(!!exp.linksTypewriter);
  ctx.true(!!exp.optionsTypewriter);
  ctx.true(!!exp.rowTypewriter);
  ctx.true(!!exp.summaryTypewriter);
  ctx.true(!!exp.textTypewriter);
  ctx.true(!!exp.titleTypewriter);
  ctx.true(!!exp.usageTypewriter);
});

export default spec;
