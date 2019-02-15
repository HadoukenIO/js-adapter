The HadoukenIO node-adapter allows the use of the Hadouken API from Node.js applications.

## Requirements

- Node.js LTS ^6.9

### Install as dependency

$ `npm install -S HadoukenIO/node-adapter`

### Usage

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
