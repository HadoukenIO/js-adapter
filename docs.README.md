The HadoukenIO node-adapter allows the use of the Hadouken API from Node.js applications.

## Requirements

- Node.js LTS ^6.9

### Install as dependency

$ `npm install -S HadoukenIO/node-adapter`

### Usage

Connecting to an already running runtime

```javascript
const { connect, Identity } = require("hadouken-js-adapter");

connect({
    address: "ws://localhost:9696",
    uuid: "my-uuid-123"
}).then(logic).catch(connError);

function logic(fin) {

    fin.System.getVersion().then(v => console.log("Connected to Hadouken version", v));
    let win;
    fin.Window.wrap({
        uuid: "remote-app-uuid",
        name: "remote-window-name"
    }).then(w => { win = w; win.moveBy(500, 0)).then(win.flash());

}

function connError(err) {

    console.log("Error trying to connect,", err.message);

    console.log(err.stack);
}
```

Launching a runtime and connecting

```javascript
const { connect, Identity } = require("hadouken-js-adapter");

connect({
    uuid: "my-uuid-123",
    runtime: {
        version: 'stable'
    }
}).then(logic).catch(connError);

function logic(fin) {
    // Logic goes here
}

function connError(err) {

    console.log("Error trying to connect,", err.message);

    console.log(err.stack);
}
```

Note that either an address or a runtime object with version are required to connect