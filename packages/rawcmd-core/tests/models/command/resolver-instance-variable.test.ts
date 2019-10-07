import { Spec } from '@hayspec/spec';
import { Command } from '../../../src';

const spec = new Spec();

spec.test('returns command resolver', async (ctx) => {
  const resolver = () => true;
  const command = new Command({ resolver });
  ctx.is(command.resolver, resolver);
});

export default spec;
