import fs = require("fs")

export default function writeToken(path: string, token: string): Promise { 
    return new Promise(resolve => {
        fs.writeFile(path, token, resolve)
    })
}