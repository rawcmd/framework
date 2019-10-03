import { Spec } from '@hayspec/spec';
import { Option } from '../../../src';

const spec = new Spec();

spec.test('returns command option name', async (ctx) => {
  const option = new Option({ name: 'foo' });
  ctx.is(option.name, 'foo');
});

export default spec;
