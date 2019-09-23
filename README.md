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

    await fin.Application.start({
        name: "adapter-test-app",
        url: 'http://hadouken.io/',
        uuid: "adapter-test-app",
        autoShow: true,
        nonPersistent : true
    });
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

    await fin.Application.start({
        name: "adapter-test-app",
        url: 'http://hadouken.io/',
        uuid: "adapter-test-app",
        autoShow: true,
        nonPersistent : true
    });
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
## Contributing

1. Fork it (<https://github.com/HadoukenIO/js-adapter/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [contribution guidelines](.github/CONTRIBUTING.md) and [Community Code of Conduct](https://www.finos.org/code-of-conduct)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS OR who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the FINOS Clabot tool. Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org)*

## License
The code in this repository is distributed under the Apache License, Version 2.0

However, if you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are covered by OpenFin's Developer, Community, and Enterprise licenses. You can learn more about OpenFin licensing at the links listed below or just email us at support@openfin.co with questions.

Copyright 2018-2019 OpenFin

https://openfin.co/developer-agreement/

https://openfin.co/licensing/


