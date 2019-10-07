import { Spec } from '@hayspec/spec';
import { Command } from '@rawcmd/core';
import { summaryTypewriter, EOL } from '../../src';

const spec = new Spec<{
  command: Command;
}>();

spec.before((sta) => {
  sta.set('command', new Command({
    summary: 'hello',
  }));
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(summaryTypewriter()(
    ctx.get('command'),
  ), [
    '\u001b[1mSUMMARY\u001b[22m                                                                         ',
    'hello                                                                           ',
  ].join(EOL));
});

export default spec;
