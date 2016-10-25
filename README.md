# OpenFin JavaScript (Node.js, Electron & browser) adapter

# Install as dependency

$ `npm install -S openfin/js-adapter`

# Usage

    const { connect } = require("js-adapter")

    connect("ws://localhost:9696", "my-uuid-123")
        .then(fin => fin.System.getVersion())
        .then(v => console.log("Connected to OpenFin version", v))

# Local build

$ `npm install`

# Test

$ `openfin -l -c test/app.json &`  
$ `npm test`