import { Spec } from '@hayspec/spec';
import { Command } from '@rawcmd/core';
import { linksTypewriter, EOL } from '../../src';

const spec = new Spec<{
  command: Command;
}>();

spec.before((sta) => {
  sta.set('command', new Command({
    links: [
      { name: 'foo0', url: 'foo1' },
      { name: 'bar0', url: 'bar1' },
    ],
  }));
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(linksTypewriter()(
    ctx.get('command'),
  ), [
    '\u001b[1mLINKS\u001b[22m                                                                           ',
    'foo0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m foo1                                                                  ',
    'bar0 \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m bar1                                                                  ',
  ].join(EOL));
});

export default spec;
