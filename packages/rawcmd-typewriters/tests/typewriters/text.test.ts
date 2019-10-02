import { Spec } from '@hayspec/spec';
import chalk from 'chalk';
import { EOL, textTypewriter, TextColor, TextAlign } from '../../src';

const spec = new Spec();

spec.test('passes through', (ctx) => {
  ctx.is(textTypewriter()('XXX'), 'XXX');
});

spec.test('supports bold text', (ctx) => {
  ctx.is(textTypewriter({ bold: true })('XXX'), chalk.bold('XXX'));
  ctx.is(textTypewriter({ bold: true })('.'), chalk.bold('.'));
});

spec.test('supports text dimming', (ctx) => {
  ctx.is(textTypewriter({ dim: true })('XXX'), chalk.dim('XXX'));
});

spec.test('supports underlined text', (ctx) => {
  ctx.is(textTypewriter({ underline: true })('XXX'), chalk.underline('XXX'));
});

spec.test('supports text color inverse', (ctx) => {
  ctx.is(textTypewriter({ inverse: true })('XXX'), chalk.inverse('XXX'));
});

spec.test('supports text color', (ctx) => {
  ctx.is(textTypewriter({ color: TextColor.BLACK })('XXX'), chalk.black('XXX'));
  ctx.is(textTypewriter({ color: TextColor.RED })('XXX'), chalk.red('XXX'));
  ctx.is(textTypewriter({ color: TextColor.GREEN })('XXX'), chalk.green('XXX'));
  ctx.is(textTypewriter({ color: TextColor.YELLOW })('XXX'), chalk.yellow('XXX'));
  ctx.is(textTypewriter({ color: TextColor.BLUE })('XXX'), chalk.blue('XXX'));
  ctx.is(textTypewriter({ color: TextColor.MAGENTA })('XXX'), chalk.magenta('XXX'));
  ctx.is(textTypewriter({ color: TextColor.CYAN })('XXX'), chalk.cyan('XXX'));
  ctx.is(textTypewriter({ color: TextColor.WHITE })('XXX'), chalk.white('XXX'));
});

spec.test('supports text background', (ctx) => {
  ctx.is(textTypewriter({ background: TextColor.BLACK })('XXX'), chalk.bgBlack('XXX'));
  ctx.is(textTypewriter({ background: TextColor.RED })('XXX'), chalk.bgRed('XXX'));
  ctx.is(textTypewriter({ background: TextColor.GREEN })('XXX'), chalk.bgGreen('XXX'));
  ctx.is(textTypewriter({ background: TextColor.YELLOW })('XXX'), chalk.bgYellow('XXX'));
  ctx.is(textTypewriter({ background: TextColor.BLUE })('XXX'), chalk.bgBlue('XXX'));
  ctx.is(textTypewriter({ background: TextColor.MAGENTA })('XXX'), chalk.bgMagenta('XXX'));
  ctx.is(textTypewriter({ background: TextColor.CYAN })('XXX'), chalk.bgCyan('XXX'));
  ctx.is(textTypewriter({ background: TextColor.WHITE })('XXX'), chalk.bgWhite('XXX'));
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
