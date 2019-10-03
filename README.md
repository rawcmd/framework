# Rawcmd Framework

[![Build Status](https://travis-ci.org/rawcmd/framework.svg?branch=master)](https://travis-ci.org/rawcmd/framework)&nbsp;[![codecov](https://codecov.io/gh/rawcmd/framework/branch/master/graph/badge.svg)](https://codecov.io/gh/rawcmd/framework)

[Rawcmd](https://github.com/rawcmd/framework) allows for building command-line user interfaces in NodeJS. It's a lightweight and open-source framework, written with [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/rawcmd/framework) where you can also find our [issue tracker](https://github.com/rawcmd/framework/issues).

## Introduction

Rawcmd represents a scaffold for creating reach command-line user interfaces in NodeJS. The purpose of this framework is to provide the logic and methods for building custom command-line utilities.

## Installation

Run the command below to install the package.

```
$ npm install --save @rawcmd/core
$ npm install --save @rawcmd/typewriters // OPTIONAL
```

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Usage

Below we explain some of the most important features that this framework provides. Please check the API section to see a complete list of features.

### Defining commands

Command represents the entry point of your command-line program.

```ts
import { Command } from '@rawcmd/core';

const command = new Command({
  resolver() {
    console.log('Hello World!');
  },
});

command.perform(); // prints "Hello World!"
```

By nesting commands we can create a tree of commands.

```ts
const command = new Command({ // entry point (root)
  commands: [
    new Command({ // first level
      name: 'list',
      resolver() {
        console.log('List all!');
      },
      commands: [
        new Command({ // second level
          name: 'latest',
          resolver() {
            console.log('List latest!');
          },
        }),
      ],
    }),
  ],
});

command.perform('list'); // prints "List all!"
command.perform('list', 'latest'); // prints "List latest!"
```

### Processing options

Every command accepts options which we can use to adjust command execution. We can apply parsers and validators to each option to make sure the resolver receives expected input data. In case one of validators fail, the resolver throws `ValidationError` class instance.

```ts
const command = new Command({
  options: [
    {
      name: 'name',
      alias: 'n',
      parse: { // check @rawmodel/parsers for predefined parsers
        resolver(v) { return `${v}` }, // transform value to string
      },
      validate: [ // check @rawmodel/validators for predefined validators
        {
          code: 4220001,
          resolver() { return false; }, // return `false` so validation fails
        },
      ],
    },
  ],
  resolver(input) {
    console.log(input); // => { "options": { "name": "John" }, "tail": "arg1 arg2" }
  },
});

command.perform('--name=John', '--', 'arg1', 'arg2').catch((error) => {
  console.log(error); // => { "code": 4220001, "name": "ValidationError", "message": "Validation failed." }
});
```

The validation is handled by the powerful [RawModel]() framework where you will find more details regarding data validation.

### Printing messages

Every command provides methods for printing messages to the output stream. By default the output stream is set to `process.stdout`.

```ts
const command = new Command({
  resolver() {
    this.print('Hello World!'); // prints message with EOL
  },
});
```

Messages can be formated through different typewriters which can be found in `@rawcmd/typewriters` package.

```ts
import { textTypewriter } from '@rawcmd/typewriters'; 

const typewriteGreen = textTypewriter({
  bold: true,
  color: TextColor.GREEN,
});

const command = new Command({
  resolver() {
    this.write( // prints "100%" as strong green text
      typewriteGreen('100'),
      typewriteGreen('%'),
    );
    this.break(); // prints EOL
  },
});
```

### Handling errors

Errors should be triggered directly within `resolver` and handled outside command class.

```ts
import { RuntimeError } from '@rawcmd/core';

const command = new Command({
  resolver() {
    throw new RuntimeError(500001);
  },
});

command.perform().catch((error) => {
  command.print('Error', error.message);
});
```

Beside the `ValidationError` which we already mentioned above, `RuntimeError` can be thrown when an error accures. It's advised that you use your custom errors which extend `GenericError` class.

### Creating executable file

TODO

## API

**NOTE:** This section covers only the end-user related classes and methods. Please read the source code to explore more details.

### @rawcmd/core

**Command<Context>(recipe, config)**

> Command class for defining executable command.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| recipe.name | String | No | - | Command name.
| recipe.description | String | No | - | Command description.
| recipe.options.$.name | String | Yes | - | Option name.
| recipe.options.$.alias | String | No | - | Option alias.
| recipe.options.$.description | String | No | - | Option description.
| recipe.options.$.setter | Function | No | - | Custom option setter. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.options.$.getter | Function | No | - | Custom option getter. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.options.$.parser | Object | No | - | Option parser configuration. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.options.$.defaultValue | String, Function | No | - | Option default value. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.options.$.emptyValue | String, Function | No | - | Option empty value. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.options.$.validators | ValidatorRecipe[] | No | - | List of option validators. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.options.$.handlers | HandlerRecipe[] | No | - | List of option error handlers. Check [Rawmodel](https://github.com/rawmodel/framework) for details.
| recipe.commands | Command[] | No | - | List of sub commands.
| recipe.resolver | Function | No | - | Command resolver.
| config.parent | Command | No | - | Parent command class instance.
| config.context | Context | No | - | Arbitrary context data.
| config.typewriter | Typewriter | No | - | Typewriter class instance.

**Command.prototype.name**: String

> Returns command name.

**Command.prototype.description**: String

> Returns command description.

**Command.prototype.getAncestors()**: Command[]

> Returns a list of all parent command instances.

**Command.prototype.getContext()**: Context

> Returns custom context defined at initialization time.

**Command.prototype.getParent()**: Command

> Returns parent command instance.

**Command.prototype.getTypewriter()**: Typewriter

> Returns typewriter class instance.

**Command.prototype.perform(...args)**: Promise<Command>

> Performs a command based on the provided command-line arguments.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| args | String[] | No | - | List of command-line arguments (e.g. ['init', '--name=foo']). Expects parameters as `process.argv.slice(2)`.

**Command.prototype.write(...messages)**: Command

> Appends outptu stream with messages.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| messages | string[] | Yes | - | List of arbirary messages.

**Command.prototype.print(...messages)**: Command

> Writes messages to outptu stream with EOL at the end.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| messages | string[] | Yes | - | List of arbirary messages.

**Command.prototype.break()**: Command

> Writes EOL to outptu stream.

**Command.prototype.spin(message)**: Command

> Writes a message to outptu stream as spinner animation.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| message | string | Yes | - | Arbirary message.

**EOL**: String

> Holds a new-line character.

### @rawcmd/typewriters

**tableTypewriter(columns, config)**: Function(data)

> Converts data to stringified table.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| columns.$.index | Integer | Yes | - | Column index.
| columns.$.reset | Boolean | No | - | Resets previous styles.
| columns.$.bold | Boolean | No | - | Makes text brighter.
| columns.$.dim | Boolean | No | - | Makes text darker.
| columns.$.underline | Boolean | No | - | Makes text underlined.
| columns.$.inverse | Boolean | No | - | Inverses font and background colors.
| columns.$.color | String | No | - | Applyes a color to text.
| columns.$.background | Boolean | No | - | Applyes a color to background.
| columns.$.align | String | No | - | Align paragraph text.
| columns.$.width | Integer | No | - | Sets paragraph width.
| columns.$.truncate | Integer | No | - | Truncate text at position.
| config.separator | String | No | - | Custom string between columns.
| data | Any[][] | Yes | - | Two dimensional table of arbitrary data. Values are automatically converted to string.

```ts
import { tableTypewriter } from '@rawcmd/typewriters';

const typewriter = tableTypewriter([
  { index: 0, width: 20 },
  { index: 1, width: 60 },
], {
  separator: '|',
});
const text = typewriter([
  ['John', 'Smith'],
  ['Clint', 'Eastwood'],
]);
```

**textTypewriter(config)**: Function(data)

> Applyes styles to the provided string.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| config.reset | Boolean | No | - | Resets previous styles.
| config.bold | Boolean | No | - | Makes text brighter.
| config.dim | Boolean | No | - | Makes text darker.
| config.underline | Boolean | No | - | Makes text underlined.
| config.inverse | Boolean | No | - | Inverses font and background colors.
| config.color | String | No | - | Applyes a color to text.
| config.background | Boolean | No | - | Applyes a color to background.
| config.align | String | No | - | Align paragraph text.
| config.width | Integer | No | - | Sets paragraph width.
| config.truncate | Integer | No | - | Truncate text at position.
| data | String | Yes | - | Arbitrary string.

```ts
import { TextAlign, TextColor, textTypewriter } from '@rawcmd/typewriters';

const typewriter = textTypewriter({
  align: TextAlign.RIGHT,
  bold: true,
  color: TextColor.MAGENTA
  width: 80,
});
const text = typewriter('Hello World!');
```

## Packages

| Package | Description | Version
|-|-|-
| [@rawcmd/core](https://github.com/rawcmd/framework/tree/master/packages/rawcmd-core) | Core framework logic. | [![NPM Version](https://badge.fury.io/js/@rawcmd%2Fcore.svg)](https://badge.fury.io/js/%40rawcmd%2Fcore)
| [@rawcmd/typewriters](https://github.com/rawcmd/framework/tree/master/packages/rawcmd-typewriters) | Collection of typewriters. | [![NPM Version](https://badge.fury.io/js/@rawcmd%2Ftypewriters.svg)](https://badge.fury.io/js/%40rawcmd%2Ftypewriters)

## Contributing

See [CONTRIBUTING.md](https://github.com/rawcmd/framework/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/rawcmd/framework/blob/master/LICENCE) for details.
