# OpenFin JavaScript (node.js & browser) adapter

# Install

$ `npm install -S openfin/js-adapter`

# Usage

    import connectToOpenFin from "js-adapter"

    connectToOpenFin("ws://localhost:9696", "my-uuid-123")
        .then(({ System }) => {
            System.getVersion()
                .then(v => console.log("Connected to OpenFin version", v))
        })
