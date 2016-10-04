var webpack = require("webpack")

module.exports = {
    entry: "./src/main",
    output: {
        path: __dirname + "/out",
        filename: "index.js"
        //libraryTarget: "commonjs2"
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