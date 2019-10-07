import { Spec } from '@hayspec/spec';
import { Option } from '../../../src';

const spec = new Spec();

spec.test('returns command option validators', async (ctx) => {
  const validators = [{ code: 1000 }];
  const option = new Option({ validators } as any);
  ctx.deepEqual(option.validators, validators);
});

export default spec;
