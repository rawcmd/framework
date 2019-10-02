import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns command options', async (ctx) => {
  const options = [{ name: 'foo' }];
  const command = new Command({ options });
  ctx.deepEqual(command.getOptions(), options);
});

export default spec;
