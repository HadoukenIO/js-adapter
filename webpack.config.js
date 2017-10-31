const { resolve, dirname } = require('path')

const nodeExternals = require('webpack-node-externals')

const entryPath = resolve(`${__dirname}/src`)
const outPath = resolve(`${ __dirname }/dist`)
module.exports = {
    entry: resolve(entryPath, 'main.ts'),
    target: 'node',
    externals: [ nodeExternals() ],
    output: {
        path: outPath,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                include: entryPath,
                loader: 'ts-loader'
            }
        ]
    }
}