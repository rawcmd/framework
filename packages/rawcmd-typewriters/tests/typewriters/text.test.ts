import { Spec } from '@hayspec/spec';
import { textTypewriter, TextBackground, TextColor } from '../../src';

const spec = new Spec();

spec.test('passes through', (ctx) => {
  ctx.is(textTypewriter()(null), '');
  ctx.is(textTypewriter()(undefined), '');
  ctx.is(textTypewriter()(''), '');
  ctx.is(textTypewriter()('XXX'), 'XXX');
});

spec.test('supports bold text', (ctx) => {
  ctx.is(textTypewriter({ bold: true })('XXX'), '\u001b[1mXXX\u001b[22m');
  ctx.is(textTypewriter({ bold: true })('.'), '\u001b[1m.\u001b[22m');
});

spec.test('supports text dimming', (ctx) => {
  ctx.is(textTypewriter({ dim: true })('XXX'), '\u001b[2mXXX\u001b[22m');
});

spec.test('supports underlined text', (ctx) => {
  ctx.is(textTypewriter({ underline: true })('XXX'), '\u001b[4mXXX\u001b[24m');
});

spec.test('supports text color inverse', (ctx) => {
  ctx.is(textTypewriter({ inverse: true })('XXX'), '\u001b[7mXXX\u001b[27m');
});

spec.test('supports text color', (ctx) => {
  ctx.is(textTypewriter({ color: TextColor.BLACK })('XXX'), '\u001b[30mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.RED })('XXX'), '\u001b[31mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.GREEN })('XXX'), '\u001b[32mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.YELLOW })('XXX'), '\u001b[33mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.BLUE })('XXX'), '\u001b[34mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.MAGENTA })('XXX'), '\u001b[35mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.CYAN })('XXX'), '\u001b[36mXXX\u001b[39m');
  ctx.is(textTypewriter({ color: TextColor.WHITE })('XXX'), '\u001b[37mXXX\u001b[39m');
});

spec.test('supports text background', (ctx) => {
  ctx.is(textTypewriter({ background: TextBackground.BLACK })('XXX'), '\u001b[40mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.RED })('XXX'), '\u001b[41mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.GREEN })('XXX'), '\u001b[42mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.YELLOW })('XXX'), '\u001b[43mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.BLUE })('XXX'), '\u001b[44mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.MAGENTA })('XXX'), '\u001b[45mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.CYAN })('XXX'), '\u001b[46mXXX\u001b[49m');
  ctx.is(textTypewriter({ background: TextBackground.WHITE })('XXX'), '\u001b[47mXXX\u001b[49m');
});

export default spec;
