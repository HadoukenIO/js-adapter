const shell = require('shelljs');
const https = require('https');

module.exports.buildCore = function (corePath, coreDest) {
    shell.exec('npm pack');
    let tarballName = shell.ls('-l', 'hadouken-js-adapter-*').map(a => a).sort((a, b) => { b.mtimeMs - a.mtimeMs })[0].name;
    let adapterDir = shell.pwd().stdout;
    if (corePath) {
        shell.echo(`Buliding core found at ${corePath}`);
        shell.cd(corePath);
    } else {
        shell.rm('-rf', 'core');
        shell.echo('Pulling develop core from GitHub');
        shell.exec('git clone https://github.com/HadoukenIO/core.git');
        shell.cd('core');
    }

    shell.exec('npm install');
    shell.cp(`${adapterDir}/${tarballName}`, `./`);
    shell.exec(`npm install ${tarballName}`);
    shell.exec('npm install openfin-sign');
    shell.exec('npm run build');
    shell.cd('out');

    if (coreDest) {
        shell.exec('npm run deploy -- --force --target=' + coreDest, function (code, stdout, stderr) {
            if (!stderr) {
                shell.echo(`Finished! .asar was created in ${shell.pwd().stdout} and copied into ${coreDest}`);
            } else {
                shell.echo(`\r\nDeploy failed with error above and exit code: ${code} \r\n`);
            }
        });
    } else {
        shell.echo('Finished! .asar was created in ' + shell.pwd().stdout);
    }
    shell.cd(adapterDir);
};

module.exports.resolveRuntimeVersion = async function (versionOrChannel) {
    const splitVersion = versionOrChannel.split('.');
    const isVersion = splitVersion.length > 1 && splitVersion.every(x => x === '*' || /^\d+$/.test(x));
    if (isVersion) {
        const mustMatch = takeWhile(splitVersion, (x) => x !== '*');
        if (4 - mustMatch.length > 0) {
            //    tslint:disable-next-line:no-backbone-get-set-outside-model
            const res = await get('https://cdn.openfin.co/release/runtimeVersions');
            const versions = res.split('\r\n');
            const match = versions.find((v) => v.split('.').slice(0, mustMatch.length).join('.') === mustMatch.join('.'));
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
        console.log(err);
        throw Error('Could not resolve runtime version');
    }
}

async function get(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => {
                body.push(chunk);
            });
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err));
    });
}

function takeWhile(arr, func) {
    return arr.reduce(({ take, vals }, x, i, r) => take && func(x, i, r)
        ? { take: true, vals: [...vals, x] }
        : { take: false, vals },
        { take: true, vals: [] })
        .vals;
}
