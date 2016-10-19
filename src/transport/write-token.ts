import { writeFile } from "fs"

export default function writeToken(path: string, token: string): Promise<string> { 
    return new Promise(resolve => {
        writeFile(path, token, () => resolve(token))
    })
}