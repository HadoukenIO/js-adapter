# OpenFin JavaScript (node.js & browser) adapter

# Install as dependency

$ `npm install -S openfin/js-adapter`

# Usage

    import { connect } from "js-adapter"

    connect("ws://localhost:9696", "my-uuid-123")
        .then(fin => fin.System.getVersion())
        .then(v => console.log("Connected to OpenFin version", v))

# Local build

$ `npm install`

# Testing

$ `openfin -l -c test/app.json &`  
$ `npm test`