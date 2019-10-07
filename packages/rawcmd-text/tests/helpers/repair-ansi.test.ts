import { Spec } from '@hayspec/spec';
import { repairAnsi } from '../../src';

const spec = new Spec();

spec.test('adds missing characters', (ctx) => {
  ctx.deepEqual(repairAnsi(
    null,
    'This is \u001b[32ma long',
    'string 利干 sample',
    'mor\u001b[39mda pove.',
  ), [
    null,
    'This is \u001b[32ma long\u001b[39m',
    '\u001b[32mstring 利干 sample\u001b[39m',
    '\u001b[32mmor\u001b[39mda pove.',
  ]);
});

export default spec;
