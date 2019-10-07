import { Spec } from '@hayspec/spec';
import { findAnsiPairs, ANSI_CODES } from '../../src';

const spec = new Spec();

spec.test('returns ANSI character pairs', (ctx) => {
  ctx.deepEqual(findAnsiPairs(null), null);
  ctx.deepEqual(findAnsiPairs(undefined), null);
  ctx.deepEqual(findAnsiPairs(''), null);
  ctx.deepEqual(findAnsiPairs('foo'), null);
  ctx.deepEqual(findAnsiPairs(ANSI_CODES.black[0]), [ANSI_CODES.black]);
});

export default spec;
