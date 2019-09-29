> [Rawcmd](https://github.com/rawcmd/framework) core package.

[Rawcmd](https://github.com/rawcmd/framework) allows for building command-line user interfaces in NodeJS. It's a lightweight and open-source framework, written with [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/rawcmd/framework) where you can also find our [issue tracker](https://github.com/rawcmd/framework/issues).

## Example

```ts
const command = new Command<Context>({
  name: '',
  alias: '',
  description: '',
  args: [
    {
      name: '',
      alias: '',
      description: '',
      parse: { array: true, resolver(value) {} },
      validate: [
        { code: 422, resolver(value) {} },
      ],
    },
  ],
  commands: [
    new Command({ ... }),
    new Command({ ... }),
  ],
  resolver({ context, logger }) { ... },
}, {
  context: { ... },
});
command.perform(process.argv[2]);
```
