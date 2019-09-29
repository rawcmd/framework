> Collection of typewriters for styling command-line messages for [Rawcmd](https://github.com/rawcmd/framework).

[Rawcmd](https://github.com/rawcmd/framework) allows for building command-line user interfaces in NodeJS. It's a lightweight and open-source framework, written with [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/rawcmd/framework) where you can also find our [issue tracker](https://github.com/rawcmd/framework/issues).

## Example

```ts
// style text
textTypewriter({
  dim: true,
  bold: true,
})('Hello world!');

// write table
tableTypewriter({
  separator: '  ',
  columns: [
    {
      index: 0,
      dim: true,
      bold: true,
    },
    {
      index: 1,
      dim: true,
      bold: true,
    },
  ],
})([
  ['John', 'Smith'],
  ['Bob', 'Dog'],
]);
```
