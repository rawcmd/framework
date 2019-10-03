import { Spec } from '@hayspec/spec';
import { Command, Option } from '../../../src';

const spec = new Spec();

spec.test('returns command options', async (ctx) => {
  const options = [
    { name: 'foo' },
    new Option({ name: 'bar' }),
    () => ({ name: 'baz' }),
  ];
  const command = new Command({ options });
  ctx.true(command.options[0] instanceof Option);
  ctx.true(command.options[1] instanceof Option);
  ctx.true(command.options[2] instanceof Option);
  ctx.is(command.options[0].name, 'foo');
  ctx.is(command.options[1].name, 'bar');
  ctx.is(command.options[2].name, 'baz');
});

export default spec;
