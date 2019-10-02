import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns command subcommands', async (ctx) => {
  const commands = [new Command({})];
  const command = new Command({ commands });
  ctx.is(command.getCommands()[0], commands[0]);
});

export default spec;
