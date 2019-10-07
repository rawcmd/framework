import { Spec } from '@hayspec/spec';
import { Command } from '@rawcmd/core';
import { optionsTypewriter, EOL } from '../../src';

const spec = new Spec<{
  command: Command;
}>();

spec.before((sta) => {
  sta.set('command', new Command({
    options: [
      { name: 'foo0', alias: 'f', description: 'foo1' },
      { name: 'bar0', alias: 'b', description: 'bar1' },
    ],
  }));
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(optionsTypewriter()(
    ctx.get('command'),
  ), [
    '\u001b[1mOPTIONS\u001b[22m                                                                         ',
    '--foo0, -f \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m foo1                                                            ',
    '--bar0, -b \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m bar1                                                            ',
  ].join(EOL));
});

export default spec;
