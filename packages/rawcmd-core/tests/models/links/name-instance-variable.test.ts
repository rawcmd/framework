import { Spec } from '@hayspec/spec';
import { Link } from '../../../src';

const spec = new Spec();

spec.test('returns command link name', async (ctx) => {
  const link = new Link({ name: 'foo' });
  ctx.is(link.name, 'foo');
});

export default spec;
