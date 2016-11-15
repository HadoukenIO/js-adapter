import { writeFile } from "fs";

export default function writeToken(path: string, token: Token): Promise<Token> { 
    return new Promise(resolve => {
        writeFile(path, token, () => resolve(token));
    });
}