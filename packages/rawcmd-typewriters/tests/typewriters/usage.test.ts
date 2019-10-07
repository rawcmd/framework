import { Spec } from '@hayspec/spec';
import { Command } from '@rawcmd/core';
import { usageTypewriter, EOL } from '../../src';

const spec = new Spec<{
  command: Command;
}>();

spec.before((sta) => {
  sta.set('command', new Command());
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(usageTypewriter()(
    ctx.get('command'),
  ), [
    '\u001b[1mUSAGE\u001b[22m                                                                           ',
    '$ <COMMAND>                                                                     ',
    '$ <OPTION>                                                                      ',
  ].join(EOL));
});

export default spec;
