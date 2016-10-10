var webpack = require("webpack")

// Update this, or move to Jake completely?
module.exports = {
    entry: "./src/main",
    output: {
        path: __dirname + "/out",
        filename: "main.js",
        libraryTarget: "commonjs2"
    },
    externals: [
        "ws",
        "fs"
    ],
    resolve: {
        extensions: [ "", ".ts", ".js" ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: "ts" }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            //Promise: "bluebird"
        })
    ]
}