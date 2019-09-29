import { Spec } from '@hayspec/spec';
import { EOL } from 'os';
import { textTypewriter, TextColor, TextAlign } from '../../src';

const spec = new Spec();

spec.test('passes through', (ctx) => {
  ctx.is(textTypewriter()('XXX'), 'XXX');
});

spec.test('supports bold text', (ctx) => {
  ctx.is(textTypewriter({ bold: true })('XXX'), '\x1b[1mXXX\x1b[0m');
});

spec.test('supports text dimming', (ctx) => {
  ctx.is(textTypewriter({ dim: true })('XXX'), '\x1b[2mXXX\x1b[0m');
});

spec.test('supports underlined text', (ctx) => {
  ctx.is(textTypewriter({ underline: true })('XXX'), '\x1b[4mXXX\x1b[0m');
});

spec.test('supports text color inverse', (ctx) => {
  ctx.is(textTypewriter({ inverse: true })('XXX'), '\x1b[7mXXX\x1b[0m');
});

spec.test('supports text color', (ctx) => {
  ctx.is(textTypewriter({ color: TextColor.BLACK })('XXX'), '\x1b[30mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.RED })('XXX'), '\x1b[31mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.GREEN })('XXX'), '\x1b[32mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.YELLOW })('XXX'), '\x1b[33mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.BLUE })('XXX'), '\x1b[34mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.MAGENTA })('XXX'), '\x1b[35mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.CYAN })('XXX'), '\x1b[36mXXX\x1b[0m');
  ctx.is(textTypewriter({ color: TextColor.WHITE })('XXX'), '\x1b[37mXXX\x1b[0m');
});

spec.test('supports text background', (ctx) => {
  ctx.is(textTypewriter({ background: TextColor.BLACK })('XXX'), '\x1b[40mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.RED })('XXX'), '\x1b[41mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.GREEN })('XXX'), '\x1b[42mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.YELLOW })('XXX'), '\x1b[43mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.BLUE })('XXX'), '\x1b[44mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.MAGENTA })('XXX'), '\x1b[45mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.CYAN })('XXX'), '\x1b[46mXXX\x1b[0m');
  ctx.is(textTypewriter({ background: TextColor.WHITE })('XXX'), '\x1b[47mXXX\x1b[0m');
});

spec.test('supports paragraph width', (ctx) => {
  const typewriter = textTypewriter({ width: 20 });
  const text = typewriter('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
  ctx.deepEqual(text, [
    'Lorem Ipsum is      ',
    'simply dummy text of',
    'the printing and    ',
    'typesetting         ',
    'industry.           '
  ].join(EOL));
});

spec.test('supports paragraph aligment', (ctx) => {
  const typewriter0 = textTypewriter({ width: 20, align: TextAlign.RIGHT });
  const typewriter1 = textTypewriter({ width: 20, align: TextAlign.CENTER });
  const text0 = typewriter0('Lorem Ipsum is simply dummy text.');
  const text1 = typewriter1('Lorem Ipsum is simply dummy text.');
  ctx.deepEqual(text0, [
    '      Lorem Ipsum is',
    '  simply dummy text.',
  ].join(EOL));
  ctx.deepEqual(text1, [
    '   Lorem Ipsum is   ',
    ' simply dummy text. ',
  ].join(EOL));
});

spec.test('supports paragraph truncation', (ctx) => {
  const typewriter = textTypewriter({ width: 20, truncate: 30 });
  const text = typewriter('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
  ctx.deepEqual(text, [
    'Lorem Ipsum is      ',
    'simply dummy...     ',
  ].join(EOL));
});

export default spec;
