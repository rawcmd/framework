import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns parent command instance', async (ctx) => {
  const parent = new Command({});
  const command = new Command({ parent });
  ctx.is(command.getParent(), parent);
});

export default spec;
