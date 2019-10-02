import { Spec } from '@hayspec/spec';
import { EOL, batchTypewriter } from '../../src';

const spec = new Spec();

spec.test('concatenates list of strings', (ctx) => {
  const typewriter = batchTypewriter();
  const text = typewriter(['a', 'b']);
  ctx.deepEqual(text, ['a', 'b'].join(EOL));
});

spec.test('supports custom separator', (ctx) => {
  const typewriter = batchTypewriter({ separator: 'X' });
  const text = typewriter(['a', 'b']);
  ctx.deepEqual(text, ['a', 'b'].join('X'));
});

export default spec;
