import { Spec } from '@hayspec/spec';
import { EOL } from 'os';

const spec = new Spec();

spec.test('writes chunks', async (ctx) => {
  const { stdout } = await ctx.exec([
    `npx ts-node -e "`,
    `import { ConsoleStreamlet } from './src/streamlets/console';`,
    `const s = new ConsoleStreamlet();`,
    `s.write('a');`,
    `s.write('b');`,
    `s.write('c');`,
    `s.write('d');`,
    `"`,
  ].join(''));
  ctx.is(stdout, 'abcd');
});

spec.test('converts EOLs to valid EOL', async (ctx) => {
  const { stdout } = await ctx.exec([
    `npx ts-node -e "`,
    `import { ConsoleStreamlet } from './src/streamlets/console';`,
    `const s = new ConsoleStreamlet();`,
    `s.write('a\\nb\\r\\nc');`,
    `"`,
  ].join(''));
  ctx.is(stdout, `a${EOL}b${EOL}c`);
});

export default spec;
