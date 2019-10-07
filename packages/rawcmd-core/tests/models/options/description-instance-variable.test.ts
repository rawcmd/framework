import { Spec } from '@hayspec/spec';
import { Option } from '../../../src';

const spec = new Spec();

spec.test('returns command option description', async (ctx) => {
  const option = new Option({ description: 'foo' } as any);
  ctx.is(option.description, 'foo');
});

export default spec;
