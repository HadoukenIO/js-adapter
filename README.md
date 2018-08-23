# Hadouken Node.js adapter [![Build Status](https://build.openf.in:443/buildStatus/icon?job=node-adapter&style=plastic)]()

Allows the use of the Hadouken API from node.js.

## Requirements

- Node.js LTS ^6.9

## Install as dependency

$ `npm install -S hadouken-js-adapter`

## Usage

Connecting to an already running runtime

```javascript
const { connect, Identity } = require("hadouken-js-adapter");

async function launchApp() {
    const fin  = await connect({
        address: "ws://localhost:9696",
        uuid: "my-uuid-123"
    });

    const version = await fin.System.getVersion();
    console.log("Connected to Hadouken version", version);

    const app = await fin.Application.create({
	name: "adapter-test-app",
	url: 'http://hadouken.io/',
	uuid: "adapter-test-app",
	autoShow: true,
	nonPersistent : true
    });

    await app.run();
}

launchApp().then(() => {
    console.log("success");
}).catch((err) => {
    console.log("Error trying to connect,", err.message);
    console.log(err.stack);
});
```

Launching a runtime and connecting

```javascript
const { connect, Identity } = require("hadouken-js-adapter");

async function launchApp() {
    const fin  = await connect({
        uuid: "my-uuid-123",
        runtime: {
            version: 'stable'
        }
    });

    const version = await fin.System.getVersion();
    console.log("Connected to Hadouken version", version);

    const app = await fin.Application.create({
        name: "adapter-test-app",
        url: 'http://hadouken.io/',
        uuid: "adapter-test-app",
        autoShow: true,
        nonPersistent : true
    });

    await app.run();
}

launchApp().then(() => {
    console.log("success");
}).catch((err) => {
    console.log("Error trying to connect,", err.message);
    console.log(err.stack);
});

```

Note that either an address or a runtime object with version are required to connect

## Mac and Linux Environment settings

In order to configure system policies, the js adapter respects the following [group policy settings](https://openfin.co/group-policy/#toggle-id-1) when set as environment variables on Mac and Linux:

- assetsUrl
- runtimeArgs
- runtimeDirectory

## Local build

```bash
npm run build
```

## Test

```bash
npm test -- --ver=alpha
```

Only executing tests that pattern match "Application"

```bash
npm test -- --ver=alpha --grep="Application"
```

Executing tests that do not pattern match "System"

```bash
npm test -- --ver=alpha --invert --grep="System"
```

## Test with core

```bash
npm test -- --ver=alpha --build-core --core=~/core
```

or without specifying the core path (core will be cloned from GH into `core` directory):

```bash
npm test -- --ver=alpha --build-core
```

## Repl

To start the read-eval-print loop:

```bash
npm run repl -- --ver=alpha
```

## Generated documentation

We use [JSDoc](http://usejsdoc.org/) for documentation and generating the documentation will require our custom JSDoc template. Use the following commands to execute the docs task:

```bash
git submodule init
git submodule update
npm run doc
```
