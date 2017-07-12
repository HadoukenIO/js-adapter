# Hadouken Node.js adapter [![Build Status](https://build.openf.in:443/buildStatus/icon?job=node-adapter&style=plastic)]()

Allows the use of the Hadouken API from Node.js

## Requirements

- Node.js LTS ^6.9 

## For the Openfin app developer

For those wishing to use the node adapter to develop their Openfin app.

### Install as dependency

$ `npm install -S HadoukenIO/node-adapter`

### Usage
```javascript
const { connect, Identity } = require("node-adapter");

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
## For the node adapter developer

For those wishing to contribute to the node-adapter project.

### Clone/Install

Clone the repo and install the dependencies:

```bash
git clone https://github.com/HadoukenIO/node-adapter.git
cd node-adapter
npm install
```

### Local build

```bash
npm run build
```

### Test

```bash
npm test -- --ver=alpha`
```

Only executing tests that pattern match "Application"

```bash
npm test -- --ver=alpha --grep="Application"`
```

Executing tests that do not pattern match "System"

```bash
npm test -- --ver=alpha --invert --grep="System"`
```

## Repl

To start the read-eval-print loop:

$ `npm run repl -- --ver=alpha`
