import fs = require("fs")
import Promise = require("bluebird")

export default function writeToken(path: string, token: string): Promise { 
    return new Promise(resolve => {
        fs.writeFile(path, token, resolve)
    })
}