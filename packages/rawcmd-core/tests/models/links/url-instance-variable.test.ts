import { Spec } from '@hayspec/spec';
import { Link } from '../../../src';

const spec = new Spec();

spec.test('returns command link url', async (ctx) => {
  const link = new Link({ url: 'foo' } as any);
  ctx.is(link.url, 'foo');
});

export default spec;
