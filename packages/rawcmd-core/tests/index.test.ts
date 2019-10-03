import { Spec } from '@hayspec/spec';
import * as exp from '../src';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!exp.Command);
  ctx.true(!!exp.ConsoleStreamlet);
  ctx.true(!!exp.EOL);
  ctx.true(!!exp.ErrorCode);
  ctx.true(!!exp.GenericError);
  ctx.true(!!exp.MemoryStreamlet);
  ctx.true(!!exp.Option);
  ctx.true(!!exp.RuntimeError);
  ctx.true(!!exp.Spinner);
  ctx.true(!!exp.Typewriter);
  ctx.true(!!exp.ValidationError);
});

export default spec;
