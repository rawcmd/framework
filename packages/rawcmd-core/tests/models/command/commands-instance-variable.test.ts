import { Spec } from '@hayspec/spec';
import { Command } from '../../../src';

const spec = new Spec();

spec.test('returns command subcommands', async (ctx) => {
  const commands = [
    { name: 'foo' },
    new Command({ name: 'bar' }),
  ];
  const command = new Command({ commands });
  ctx.true(command.commands[0] instanceof Command);
  ctx.true(command.commands[1] instanceof Command);
  ctx.is(command.commands[0].name, 'foo');
  ctx.is(command.commands[1].name, 'bar');
});

export default spec;
