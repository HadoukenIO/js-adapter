# Hadouken Node.js adapter [![Build Status](https://build.openf.in:443/buildStatus/icon?job=node-adapter&style=plastic)]()

Allows the use of the Hadouken API from Node.js

# Requirements

- Node.js LTS ^6.9 

# Install as dependency

$ `npm install -S HadoukenIO/node-adapter`

# Usage
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
# Local build

$ `npm run build`

# Test

$ `npm test -- --ver=alpha`

Only executing tests that pattern match "Application"

$ `npm test -- --ver=alpha --grep="Application"`

Executing tests that do not pattern match "System"

$ `npm test -- --ver=alpha --invert --grep="System"`

# Repl

$ `npm run repl -- --ver=alpha`
