import { writeFile } from "fs"

export default function writeToken(path: string, token: string): Promise<any> { 
    return new Promise(resolve => {
        writeFile(path, token, resolve)
    })
}