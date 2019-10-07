import { Spec } from '@hayspec/spec';
import { EOL, rowTypewriter } from '../../src';
import { TextAlign } from '@rawcmd/text';

const spec = new Spec<{
  data: any[][];
}>();

spec.test('passes through', (ctx) => {
  ctx.is(rowTypewriter()(null), '');
  ctx.is(rowTypewriter()(undefined), '');
  ctx.is(rowTypewriter()([]), '');
});

spec.test('builds string columns', (ctx) => {
  ctx.is(rowTypewriter()([
    'John',
    'Loremšč Ipsćžum',
    100,
  ]), [
    'John Loremšč Ipsćžum 100',
    '',
  ].join(EOL));
});

spec.test('supports column width', (ctx) => {
  ctx.is(rowTypewriter([
    { index: 0, width: 10 },
    { index: 1, width: 20 },
  ])([
    'Loremšč Ipsćžum is simply',
    'This is \u001b[32ma long 火腿 string sam火ple',
  ]), [
    'Loremšč    This is \u001b[32ma long 火腿\u001b[39m \n' +
    'Ipsćžum    \u001b[32mstring sam火ple\u001b[39m     \n' +
    'is simply                      \n',
  ].join(EOL));
});

spec.test('supports text truncation', (ctx) => {
  ctx.is(rowTypewriter([
    { index: 0, width: 10, textLength: 10 },
    { index: 1, width: 10, textLength: 20 },
    { index: 2, width: 10, textLength: 14 },
  ])([
    'Loremšč Ipsćžum is simply',
    'This is \u001b[32ma long 火腿 string sam火ple',
    'Th火is is 腿 string foo',
  ]), [
    'Loremšč I… This is \u001b[32ma\u001b[39m  Th火is is ',
    '           \u001b[32mlong\u001b[39m       腿 …      ',
    '           \u001b[32m火腿…\u001b[39m                ',
    '',
  ].join(EOL));
});

spec.test('supports word wrapping', (ctx) => {
  ctx.is(rowTypewriter([
    { index: 0, width: 10, textWrap: false },
    { index: 1, width: 12, textWrap: true },
  ])([
    'Loremšč Ipsćžum is simply',
    'This is \u001b[32ma long 火腿 string sam火ple',
  ]), [
    'Loremšč I… This is \u001b[32ma\u001b[39m   ',
    '           \u001b[32mlong 火腿\u001b[39m   ',
    '           \u001b[32mstring\u001b[39m      ',
    '           \u001b[32msam火ple\u001b[39m    ',
    '',
  ].join(EOL));
});

spec.test('supports text alignment', (ctx) => {
  ctx.is(rowTypewriter([
    { index: 0, width: 15, textAlign: TextAlign.LEFT },
    { index: 1, width: 15, textAlign: TextAlign.CENTER },
    { index: 2, width: 15, textAlign: TextAlign.RIGHT },
  ])([
    'Loremšč Ipsćžum is simply string sam火ple',
    'This is \u001b[32ma long 火腿 string sam火ple',
    'Th火is is 腿 string foo string sam火ple',
  ]), [
    'Loremšč Ipsćžum  This is \u001b[32ma long\u001b[39m    Th火is is 腿',
    'is simply         \u001b[32m火腿 string\u001b[39m        string foo',
    'string              \u001b[32msam火ple\u001b[39m             string',
    'sam火ple                               sam火ple',
    '',
  ].join(EOL));
});

spec.test('supports custom column separator simbol', (ctx) => {
  ctx.is(rowTypewriter([
    { index: 0, width: 10 },
    { index: 1, width: 20 },
  ], {
    separatorSymbol: '!',
  })([
    'Loremšč Ipsćžum is simply',
    'This is \u001b[32ma long 火腿 string sam火ple',
  ]), [
    'Loremšč   !This is \u001b[32ma long 火腿\u001b[39m ',
    'Ipsćžum   !\u001b[32mstring sam火ple\u001b[39m     ',
    'is simply !                    ',
    '',
  ].join(EOL));
});

spec.test('supports custom truncation simbol', (ctx) => {
  ctx.is(rowTypewriter([
    { index: 0, textLength: 10 },
    { index: 1, textLength: 10 },
  ], {
    truncationSymbol: '!',
  })([
    'Loremšč Ipsćžum is simply',
    'This is \u001b[32ma long 火腿 string sam火ple',
  ]), [
    'Loremšč I! This is \u001b[32ma!\u001b[39m',
    '',
  ].join(EOL));
});

export default spec;
