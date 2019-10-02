import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns arbitrary context data', async (ctx) => {
  const context = { foo: true };

  const command0 = new Command({});
  const command1 = new Command({ context });

  ctx.is(command0.getContext(), null);
  ctx.is(command1.getContext(), context);
});

export default spec;
