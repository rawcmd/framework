import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('returns list of all parent commands', async (ctx) => {
  const parent0 = new Command({});
  const parent1 = new Command({ parent: parent0 });
  const parent2 = new Command({ parent: parent1 });
  const command = new Command({ parent: parent2 });
  ctx.deepEqual(command.getAncestors(), [parent0, parent1, parent2]);
});

export default spec;
