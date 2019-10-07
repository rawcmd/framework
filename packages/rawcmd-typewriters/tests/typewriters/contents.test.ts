import { Spec } from '@hayspec/spec';
import { contentsTypewriter, EOL } from '../../src';

const spec = new Spec<{
  data: string[][];
}>();

spec.before((sta) => {
  sta.set('data', [
    ['foo', 'foo'],
    ['bar', 'bar'],
  ]);
});

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(contentsTypewriter()(
    ctx.get('data'),
  ), [
    'foo \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m foo                                                                    ',
    'bar \u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m\u001b[2m.\u001b[22m bar                                                                    ',
  ].join(EOL));
});

export default spec;
