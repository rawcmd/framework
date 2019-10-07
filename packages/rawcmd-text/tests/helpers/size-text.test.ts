import { Spec } from '@hayspec/spec';
import { sizeText } from '../../src';

const spec = new Spec();

spec.test('calculates text size', (ctx) => {
  ctx.is(sizeText(null), 0 );
  ctx.is(sizeText(undefined), 0 );
  ctx.is(sizeText(''), 0 );
  ctx.is(sizeText('This is \u001b[32ma long'), 14);
  ctx.is(sizeText('This 利干g'), 10);
});

export default spec;
