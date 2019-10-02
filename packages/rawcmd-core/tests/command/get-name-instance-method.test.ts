import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns command name', async (ctx) => {
  const command = new Command({ name: 'foo' });
  ctx.is(command.getName(), 'foo');
});

export default spec;
