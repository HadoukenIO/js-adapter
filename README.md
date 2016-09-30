# OpenFin JavaScript (node.js & browser) adapter

# Install

$ `npm install -S openfin/js-adapter`

# Usage

    import { connect } from "js-adapter"

    connect("ws://localhost:9696", "my-uuid-123")
        .then(({ System }) => {
            System.getVersion()
                .then(v => console.log("Connected to OpenFin version", v))
        })

# Testing

$ `openfin -l -c test/app.json &`
$ `npm test`