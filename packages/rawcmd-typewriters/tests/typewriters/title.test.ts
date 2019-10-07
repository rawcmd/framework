import { Spec } from '@hayspec/spec';
import { EOL, titleTypewriter } from '../../src';

const spec = new Spec();

spec.test('builds output string', (ctx) => {
  ctx.deepEqual(titleTypewriter()('foo'), [
    '\u001b[1mFOO\u001b[22m                                                                             ',
  ].join(EOL));
});

export default spec;
