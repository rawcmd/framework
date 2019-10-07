import { Spec } from '@hayspec/spec';
import { Command } from '@rawcmd/core';
import { helpTypewriter, EOL } from '../../src';

const spec = new Spec<{
  command: Command;
}>();

spec.before((sta) => {
  sta.set('command', new Command({
    summary: 'hello',
    commands: [
      { name: 'foo0', description: 'foo1' },
      { name: 'bar0', description: 'bar1' },
    ],
    options: [
      { name: 'foo0', alias: 'f', description: 'foo1' },
      { name: 'bar0', alias: 'b', description: 'bar1' },
    ],
    links: [
      { name: 'a0', url: 'a1' },
      { name: 'b0', url: 'b1' },
    ],
  }));
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(helpTypewriter()(
    ctx.get('command'),
  ), [
    '\u001b[1mSUMMARY\u001b[22m                                                                         ',
    'hello                                                                           ',
    '',
    '\u001b[1mUSAGE\u001b[22m                                                                           ',
    '$ <COMMAND>                                                                     ',
    '$ <OPTION>                                                                      ',
    '',
    '\u001b[1mCOMMANDS\u001b[22m                                                                        ',
    'foo0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m foo1                                                                  ',
    'bar0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m bar1                                                                  ',
    '',
    '\u001b[1mOPTIONS\u001b[22m                                                                         ',
    '--foo0, -f \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m foo1                                                            ',
    '--bar0, -b \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m bar1                                                            ',
    '',
    '\u001b[1mLINKS\u001b[22m                                                                           ',
    'a0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m a1                                                                      ',
    'b0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m b1                                                                      ',
  ].join(EOL));
});

export default spec;
