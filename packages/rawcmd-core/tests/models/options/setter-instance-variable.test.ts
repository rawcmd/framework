import { Spec } from '@hayspec/spec';
import { Option } from '../../../src';

const spec = new Spec();

spec.test('returns command option setter', async (ctx) => {
  const setter = () => true;
  const option = new Option({ setter } as any);
  ctx.is(option.setter, setter);
});

export default spec;
