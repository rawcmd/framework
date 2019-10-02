import { Spec } from '@hayspec/spec';
import chalk from 'chalk';
import { EOL, tableTypewriter } from '../../src';

const spec = new Spec<{
  data: any[][];
}>();

spec.beforeEach((ctx) => {
  ctx.set('data', [
    ['John', 'Loremšč Ipsćžum is simply dummy text of the printing', 100],
    ['Bob', 'Loremšč Ipsćžum', 200],
    ['Lary', 'Loremšč Ipsćžum is simply dummy', 300],
  ]);
});

spec.test('passes through', (ctx) => {
  const typewriter = tableTypewriter();
  ctx.is(typewriter([]), '');
});

spec.test('supports columns', (ctx) => {
  const data = ctx.get('data');
  const typewriter = tableTypewriter();
  ctx.is(typewriter(data), [
    'John  Loremšč Ipsćžum is simply dummy text of the printing  100',
    'Bob   Loremšč Ipsćžum                                       200',
    'Lary  Loremšč Ipsćžum is simply dummy                       300',
    '',
  ].join(EOL));
});

spec.test('supports column width', (ctx) => {
  const data = ctx.get('data');
  const typewriter = tableTypewriter([
    { index: 1, width: 25 },
  ]);
  ctx.is(typewriter(data), [
    'John  Loremšč Ipsćžum is simply  100',
    '      dummy text of the             ',
    '      printing                      ',
    'Bob   Loremšč Ipsćžum            200',
    'Lary  Loremšč Ipsćžum is simply  300',
    '      dummy                         ',
    '',
  ].join(EOL));
});

spec.test('supports column styles', (ctx) => {
  const data = ctx.get('data');
  const typewriter = tableTypewriter([
    { index: 1, width: 25 },
  ]);
  data[1][0] = chalk.bold('Bob');
  data[2][2] = chalk.red('300');
  ctx.is(typewriter(data), [
    'John  Loremšč Ipsćžum is simply  100',
    `      dummy text of the             `,
    `      printing                      `,
    `${chalk.bold('Bob')}   Loremšč Ipsćžum            200`,
    `Lary  Loremšč Ipsćžum is simply  ${chalk.red('300')}`,
    `      dummy                         `,
    ``,
  ].join(EOL));
});

spec.test('supports custom column separator', (ctx) => {
  const data = ctx.get('data');
  const typewriter = tableTypewriter([], {
    separator: '-|-',
  });
  ctx.is(typewriter(data), [
    'John-|-Loremšč Ipsćžum is simply dummy text of the printing-|-100',
    'Bob -|-Loremšč Ipsćžum                                     -|-200',
    'Lary-|-Loremšč Ipsćžum is simply dummy                     -|-300',
    '',
  ].join(EOL));
});

export default spec;
