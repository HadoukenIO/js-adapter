const { resolve, dirname } = require('path')

const entryPath = resolve(`${__dirname}/src`)
const outPath = resolve(`${ __dirname }/dist`)
module.exports = {
    entry: resolve(entryPath, '/main.ts'),
    output: {
        path: outPath,
        filename: 'bundle.js'
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