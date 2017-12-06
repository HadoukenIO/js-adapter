import * as https from 'https';
import * as fs from 'fs';

export function promisify (func: Function): (...args: any[]) => Promise<any > {
    return (...args: any[]) => new Promise((resolve, reject) => {
        func(...args, (err: Error, val: any?) => err ? reject(err) : resolve(val));
    });
};

export async function get (url: string): Promise<any > {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
          if (response.statusCode < 200 || response.statusCode > 299) {
             reject(new Error('Failed to load page, status code: ' + response.statusCode));
           }
          const body = [];
          response.on('data', (chunk) => body.push(chunk));
          response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err));
        });
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
                console.log('res', response);
                const file = fs.createWriteStream(writeLocation);
                response.pipe(file);
                file.on('finish', function() {
                    console.log
                    file.close();
                    resolve();
                });
            }
      });
    } catch (e) {
        console.log(e)
        reject(e)
    }
});
}

export async function resolveRuntimeVersion(versionOrChannel: string) : Promise< string > {
    const splitVersion = versionOrChannel.split('.');
    const isVersion = splitVersion.length === 4 && splitVersion.every(x => x === '*' || /^\d+$/.test(x));
    if (isVersion) {
        const mustMatch = takeWhile(splitVersion, x => x !== '*');
        if (splitVersion.length - mustMatch.length > 0) {
           const res = await get('https://cdn.openfin.co/release/runtimeVersions');
           const versions = res.split('\r\n'));
           const match = first(versions, (v: string) => v.split('.').slice(0, mustMatch.length).join('.') === mustMatch.join('.'));
           if (match) {
               return match;
           }
        } else {
            return versionOrChannel;
        }
    }
    try {
        return await get(`https://cdn.openfin.co/release/runtime/${versionOrChannel}`);
    } catch (err) {
        throw Error('Could not resolve runtime version');
    }
}

function first (arr: any[], func:     function) {
    for (let i = 0; i < arr.length; i ++) {
        if (func(arr[i], i, arr)) {
            return arr[i];
        }
    }
    return null;
}

function takeWhile (arr: any[], func:     function) {
   return arr.reduce(({take, vals}, ...args: any[]) => take && func(...args)
        ? {take: true, vals: [...vals, args[0]]}
        : {take: false, vals},
        {take: true, vals: []})
    .vals;
}