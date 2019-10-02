import { Spec } from '@hayspec/spec';
import { Command, Typewriter } from '../../src';

const spec = new Spec();

spec.test('returns command line printer', async (ctx) => {
  const typewriter = new Typewriter();

  const command0 = new Command({});
  const command1 = new Command({ typewriter });

  ctx.true(command0.getTypewriter() instanceof Typewriter);
  ctx.is(command1.getTypewriter(), typewriter);
});

export default spec;
