import { Spec } from '@hayspec/spec';
import { Option } from '../../../src';

const spec = new Spec();

spec.test('returns command option handlers', async (ctx) => {
  const handlers = [{ code: 1000 }];
  const option = new Option({ handlers } as any);
  ctx.deepEqual(option.handlers, handlers);
});

export default spec;
