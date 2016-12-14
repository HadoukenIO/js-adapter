# OpenFin JavaScript adapter

Works in
- Node.js v6+ 

# Install as dependency

$ `npm install -S openfin/js-adapter`

# Usage

    const { connect, Identity } = require("js-adapter")

    connect("ws://localhost:9696", "my-uuid-123").then(logic)
    
    function logic(fin) {
        fin.System.getVersion().then(v => console.log("Connected to OpenFin version", v))

        fin.Window.wrap(new Identity("remote-app-uuid", "remote-window-name"))
            .moveBy(500, 0)
    }

# Local build

$ `npm install`

# Test

$ `openfin -l -c test/app.json &`  
$ `npm test`
