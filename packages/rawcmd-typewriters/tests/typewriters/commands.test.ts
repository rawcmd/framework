import { Spec } from '@hayspec/spec';
import { Command } from '@rawcmd/core';
import { commandsTypewriter, EOL } from '../../src';

const spec = new Spec<{
  command: Command;
}>();

spec.before((sta) => {
  sta.set('command', new Command({
    commands: [
      new Command({ name: 'foo0', description: 'foo1' }),
      new Command({ name: 'bar0', description: 'bar1' }),
    ],
  }));
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(commandsTypewriter()(
    ctx.get('command'),
  ), [
    '\u001b[1mCOMMANDS\u001b[22m                                                                        ',
    'foo0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m foo1                                                                  ',
    'bar0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m bar1                                                                  ',
  ].join(EOL));
});

export default spec;
