import { Spec } from '@hayspec/spec';
import { Command } from '../../src';

const spec = new Spec();

spec.test('executes resolver', async (ctx) => {
  let resolved = null;

  const command = new Command({
    name: 'cmd0',
    resolver() { resolved = 'cmd0'; },
    commands: [
      new Command({
        name: 'cmd1',
        resolver() { resolved = 'cmd1'; },
        commands: [
          new Command({
            name: 'cmd2',
            resolver() { resolved = 'cmd2'; },
          }),
        ],
      }),
      new Command({
        name: 'cmd3',
        resolver() { resolved = 'cmd3'; },
      }),
    ],
  });

  await command.perform('cmd1', 'cmd2');
  ctx.is(resolved, 'cmd2');
  await command.perform('cmd1');
  ctx.is(resolved, 'cmd1');
  await command.perform('cmd3');
  ctx.is(resolved, 'cmd3');
  await command.perform();
  ctx.is(resolved, 'cmd0');
});

spec.test('passes options to resolver', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      { name: 'opt0a' },
      { name: 'opt0b' },
      { name: 'opt0c' },
    ],
    resolver(d) { options = d.options; },
    commands: [
      new Command({
        name: 'cmd1',
        options: [
          { name: 'opt1a' },
          { name: 'opt1b' },
          { name: 'opt1c' },
        ],
        resolver(d) { options = d.options; },
      }),
    ],
  });

  await command.perform();
  ctx.deepEqual(options, { opt0a: null, opt0b: null, opt0c: null });
  await command.perform('--opt0a=yes', '--opt0b', '--fake');
  ctx.deepEqual(options, { opt0a: 'yes', opt0b: null, opt0c: null });
  await command.perform('cmd1', '--opt1a=yes', '--opt1b', '--fake');
  ctx.deepEqual(options, { opt1a: 'yes', opt1b: null, opt1c: null });
});

spec.test('passes tail to resolver', async (ctx) => {
  let tail = null;

  const command = new Command({
    resolver(d) { tail = d.tail; },
    commands: [
      new Command({
        name: 'cmd1',
        resolver(d) { tail = d.tail; },
      }),
    ],
  });

  await command.perform();
  ctx.deepEqual(tail, null);
  await command.perform('--fake', '--', 'foo', 'bar');
  ctx.deepEqual(tail, 'foo bar');
  await command.perform('cmd1', '--fake', '--', 'foo', 'bar');
  ctx.deepEqual(tail, 'foo bar');
});

spec.test('supports option alias', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      { name: 'opt0a', alias: '0a' },
      { name: 'opt0b', alias: '0b' },
      { name: 'opt0c', alias: '0c' },
    ],
    resolver(d) { options = d.options; },
  });

  await command.perform('-0a', 'yes', '-0b', '-fake');
  ctx.deepEqual(options, { opt0a: 'yes', opt0b: null, opt0c: null });
});

spec.test('supports option customer getter', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      {
        name: 'foo',
        get() { return 'foo'; },
      }
    ],
    resolver(d) { options = d.options; },
  });

  await command.perform('--foo=100');
  ctx.deepEqual(options, { foo: 'foo' });
});

spec.test('supports option customer setter', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      {
        name: 'foo',
        set(v) { return `${v}-foo`; },
      }
    ],
    resolver(d) { options = d.options; },
  });

  await command.perform('--foo=100');
  ctx.deepEqual(options, { foo: '100-foo' });
});

spec.test('supports option parser', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      {
        name: 'foo',
        parse: {
          resolver(v) { return parseInt(v); },
        },
      },
      {
        name: 'bar',
        parse: {
          array: true,
        },
      },
    ],
    resolver(d) { options = d.options; },
  });

  await command.perform('--foo=100', '--bar=200');
  ctx.deepEqual(options, { foo: 100, bar: ['200'] });
});

spec.test('supports option default value', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      {
        name: 'foo',
        defaultValue: 'foo',
      },
    ],
    resolver(d) { options = d.options; },
  });

  await command.perform('--foo');
  ctx.deepEqual(options, { foo: 'foo' });
});

spec.test('supports option empty value', async (ctx) => {
  let options = null;

  const command = new Command({
    options: [
      {
        name: 'foo',
        emptyValue: 'foo',
      },
    ],
    resolver(d) { options = d.options; },
  });

  await command.perform();
  ctx.deepEqual(options, { foo: 'foo' });
});

spec.test('supports option validation', async (ctx) => {
  const command = new Command({
    options: [
      {
        name: 'foo',
        validate: [
          {
            code: 100,
            resolver() { return false; },
          },
        ],
      },
    ],
  });

  await ctx.throws(() => command.perform('--foo=100'));
});

spec.test('resolver shares command content', async (ctx) => {
  let context = null;

  const command = new Command({
    name: 'cmd0',
    resolver() { context = this; },
  });
  await command.perform();

  ctx.is(context, command);
});

export default spec;
