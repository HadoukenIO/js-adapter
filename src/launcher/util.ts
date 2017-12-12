import * as https from 'https';
import * as fs from 'fs';
import {exec} from 'child_process';

export function promisify (func: Function): (...args: any[]) => Promise<any > {
    return (...args: any[]) => new Promise((resolve, reject) => {
        func(...args, (err: Error, val: any) => err ? reject(err) : resolve(val));
    });
}

export async function get (url: string): Promise<any > {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body : string[] = [];
            response.on('data', (chunk: string) : void => {
                body.push(chunk);
            });
            response.on('end', () : void => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err));
        });
}

export async function unzip (file: string, dest: string) {
    const ex = promisify(exec);
    return ex(`unzip ${file} -d ${dest}`, {encoding: 'utf8'});
}

const lstat = promisify(fs.lstat);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);

export async function rmDir (dirPath: string, removeSelf: boolean = true) {
    let files: string[];
    try {
       files = await readdir(dirPath);
    } catch (e) {
      return;
    }
    if (files.length > 0) {
      await promiseMap(files, async (f: string) => {
        const filePath = dirPath + '/' + f;
        const file =  await lstat(filePath);
        if (file.isFile() || file.isSymbolicLink()) {
            await unlink(filePath);
        } else {
            await rmDir(filePath, true);
        }
      });
    }
    if (removeSelf) {
       await rmdir(dirPath);
    }
}

export async function downloadFile (url: string, writeLocation: string) {
      return new Promise((resolve, reject) => {
        try {
            https.get(url, (response) => {
            if (response.statusCode !== 200) {
                if (response.statusCode === 404) {
                    reject(new Error('Specified runtime not available for OS'));
                } else {
                    reject(new Error('Issue Downloading ' + response.statusCode));
                }
            } else {
                const file = fs.createWriteStream(writeLocation);
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }
      });
    } catch (e) {
        reject(e);
    }
});
}

export async function resolveRuntimeVersion(versionOrChannel: string) : Promise< string > {
    const splitVersion = versionOrChannel.split('.');
    const isVersion = splitVersion.length === 4 && splitVersion.every(x => x === '*' || /^\d+$/.test(x));
    if (isVersion) {
        const mustMatch = takeWhile(splitVersion, (x: string) => x !== '*');
        if (splitVersion.length - mustMatch.length > 0) {
        //    tslint:disable-next-line:no-backbone-get-set-outside-model
            const res = await get('https://cdn.openfin.co/release/runtimeVersions');
           const versions = res.split('\r\n');
           const match = first(versions, (v: string) => v.split('.').slice(0, mustMatch.length).join('.') === mustMatch.join('.'));
           if (match) {
               return match;
           }
        } else {
            return versionOrChannel;
        }
    }
    try {
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        return await get(`https://cdn.openfin.co/release/runtime/${versionOrChannel}`);
    } catch (err) {
        throw Error('Could not resolve runtime version');
    }
}

function first (arr: any[], func : (x: any, i: number, r: any[]) => boolean) {
        // tslint:disable-next-line:no-increment-decrement
        for (let i = 0; i < arr.length; i ++) {
        if (func(arr[i], i, arr)) {
            return arr[i];
        }
    }
    return null;
}

function takeWhile (arr: any[], func: (x: any, i: number, r: any[]) => boolean) {
   return arr.reduce(({take, vals}, x: any, i: number, r: any[]) => take && func(x, i, r)
        ? {take: true, vals: [...vals, x]}
        : {take: false, vals},
        {take: true, vals: []})
    .vals;
}

async function promiseMap (arr: any[], asyncF: (x: any, i: number, r: any[]) => Promise<any> ) {
    return Promise.all(arr.map(asyncF));
}