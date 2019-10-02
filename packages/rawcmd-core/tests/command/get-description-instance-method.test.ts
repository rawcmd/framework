import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns command description', async (ctx) => {
  const command = new Command({ description: 'foo' });
  ctx.is(command.getDescription(), 'foo');
});

export default spec;
