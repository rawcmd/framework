import { Spec } from '@hayspec/spec';
import { Option } from '../../../src';

const spec = new Spec();

spec.test('returns command option default value', async (ctx) => {
  const option = new Option({ defaultValue: 'foo' } as any);
  ctx.is(option.defaultValue, 'foo');
});

export default spec;
