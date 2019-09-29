import { Spec } from '@hayspec/spec';

const spec = new Spec();

spec.skip('removes last row from buffer', async (ctx) => {
  // This functionality can only be tested when TTY=true thus using ctx.exec()
  // method won't work and we'd have to test it in the master process. The
  // problem is that destroys the Hayspec output thus it's basically imposible.
});

export default spec;
