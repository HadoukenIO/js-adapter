# Hadouken Node.js adapter [![Build Status](https://build.openf.in:443/buildStatus/icon?job=node-adapter&style=plastic)]()

Allows the use of the Hadouken API from node.js. View the [documentation](https://hadoukenio.github.io/js-adapter/)

## Requirements

- Node.js LTS ^6.9

### Install as dependency

$ `npm install -S hadouken-js-adapter`

### Usage
```javascript
const { connect, Identity } = require("hadouken-js-adapter");

connect({
    address: "ws://localhost:9696",
    uuid: "my-uuid-123"
}).then(logic).catch(connError);

function logic(fin) {

    fin.System.getVersion().then(v => console.log("Connected to Hadouken version", v));

    const win = fin.Window.wrap({
        uuid: "remote-app-uuid",
        name: "remote-window-name"
    });

    win.moveBy(500, 0).then(win.flash());

}

function connError(err) {

    console.log("Error triying to connect,", err.message);

    console.log(err.stack);
}
```

### Local build

```bash
npm run build
```

### Test

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

## Repl

To start the read-eval-print loop:

```bash
npm run repl -- --ver=alpha
```
