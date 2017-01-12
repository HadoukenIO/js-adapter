# OpenFin JavaScript adapter

Works in
- Node.js LTS ^6.9 

# Install as dependency

$ `npm install -S openfin/js-adapter`

# Usage

    const { connect, Identity } = require("js-adapter");

    connect("ws://localhost:9696", "my-uuid-123").then(logic);
    
    function logic(fin) {
    
        fin.System.getVersion().then(v => console.log("Connected to OpenFin version", v));

        const win = fin.Window.wrap(new Identity("remote-app-uuid", "remote-window-name"));
        
        win.moveBy(500, 0).then(win.flash());
        
    }

# Local build

$ `grunt ts`

# Test

$ `grunt test`
