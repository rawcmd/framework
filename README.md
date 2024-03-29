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

**commandsTypewriter(options)**: Function(command)

> Returns a function which builds a string showing a list of all available sub commands with descriptions.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.title | String | No | - | Section title (defaults to `Commands`).
| options.paddingWidth | Integer | No | - | Dotted padding size (defaults to `5`).
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| command | Command | Yes | - | Command class instance.

**contentsTypewriter(options)**: Function(data)

> Returns a function which builds an arbitrary table of contents string with names and decriptions

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.paddingWidth | Integer | No | - | Dotted padding size (defaults to `5`).
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| data | String[][] | Yes | - | List of arrays with names and descriptions.

**helpTypewriter(options)**: Function(data)

> Returns a function which builds a string describing command abilities and other useful information.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| command | Command | Yes | - | Command class instance.

**linksTypewriter(options)**: Function(command)

> Returns a function which builds a string representing a list of all usefull support references and links.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.title | String | No | - | Section title (defaults to `Links`).
| options.paddingWidth | Integer | No | - | Dotted padding size (defaults to `5`).
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| command | Command | Yes | - | Command class instance.

**optionsTypewriter(options)**: Function(command)

> Returns a function which builds a string representing a list of all available command options with descriptions.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.title | String | No | - | Section title (defaults to `Options`).
| options.paddingWidth | Integer | No | - | Dotted padding size (defaults to `5`).
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| command | Command | Yes | - | Command class instance.

**rowTypewriter(columns, options)**: Function(data)

> Converts data to stringified table.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| columns.$.index | Integer | Yes | - | Column index.
| columns.$.width | Integer | No | - | Columns width.
| columns.$.textAlign | String | No | left | Text alignment.
| columns.$.textLength | Integer | No | - | Text truncation size.
| columns.$.textWrap | Boolean | No | true | Wrapps long strings into multiple rows.
| columns.$.truncate | Integer | No | - | Truncate text at position.
| options.separatorSymbol | String | No | - | Custom string between columns.
| options.truncationSymbol | String | No | - | Custom truncation simbol.
| data | Any[][] | Yes | - | Two dimensional table of arbitrary data. Values are automatically converted to string.

```ts
import { rowTypewriter } from '@rawcmd/typewriters';

const typewriter = rowTypewriter([
  { index: 0, width: 20 },
  { index: 1, width: 60 },
], {
  separatorSymbol: ' | ',
});
const text = typewriter([
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
]);
```

**summaryTypewriter(options)**: Function(command)

> Returns a function which builds a string representing command summary text.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.title | String | No | - | Section title (defaults to `Summary`).
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| command | Command | Yes | - | Command class instance.

**textTypewriter(options)**: Function(data)

> Applyes styles to the provided string.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.reset | Boolean | No | - | Resets current styles.
| options.bold | Boolean | No | - | Makes text brighter.
| options.dim | Boolean | No | - | Makes text darker.
| options.underline | Boolean | No | - | Makes text underlined.
| options.inverse | Boolean | No | - | Inverses font and background colors.
| options.color | String | No | - | Applyes a color to text.
| options.background | Boolean | No | - | Applyes a color to background.
| data | String | Yes | - | Arbitrary string.

```ts
import { TextAlign, TextColor, textTypewriter } from '@rawcmd/typewriters';

const typewriter = textTypewriter({
  align: TextAlign.RIGHT,
  bold: true,
  color: TextColor.MAGENTA
});
const text = typewriter('Hello World!');
```

**titleTypewriter**: Function(text)

> Returns a function which builds a string representing section title.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| text | String | Yes | - | Arbitrary text.

**usageTypewriter**: Function(command)

> Returns a function which builds a string showing how the command should be used with examples.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.title | String | No | - | Section title (defaults to `Usage`).
| options.totalWidth | Integer | No | - | Allowed horizontal width (defaults to `80`).
| command | Command | Yes | - | Command class instance.

## Packages

| Package | Description | Version
|-|-|-
| [@rawcmd/core](https://github.com/rawcmd/framework/tree/master/packages/rawcmd-core) | Core framework logic. | [![NPM Version](https://badge.fury.io/js/@rawcmd%2Fcore.svg)](https://badge.fury.io/js/%40rawcmd%2Fcore)
| [@rawcmd/text](https://github.com/rawcmd/framework/tree/master/packages/rawcmd-text) | Text manipulation methods. | [![NPM Version](https://badge.fury.io/js/@rawcmd%2Ftext.svg)](https://badge.fury.io/js/%40rawcmd%2Fcore)
| [@rawcmd/typewriters](https://github.com/rawcmd/framework/tree/master/packages/rawcmd-typewriters) | Collection of typewriters. | [![NPM Version](https://badge.fury.io/js/@rawcmd%2Ftypewriters.svg)](https://badge.fury.io/js/%40rawcmd%2Ftypewriters)
| [@rawcmd/utils](https://github.com/rawcmd/framework/tree/master/packages/rawcmd-utils) | Helper functions. | [![NPM Version](https://badge.fury.io/js/@rawcmd%2Futils.svg)](https://badge.fury.io/js/%40rawcmd%2Futils)

## Contributing

See [CONTRIBUTING.md](https://github.com/rawcmd/framework/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/rawcmd/framework/blob/master/LICENCE) for details.
