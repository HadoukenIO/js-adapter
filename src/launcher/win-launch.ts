import * as fs from 'fs';
import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import { exists } from './util';
import { NewConnectConfig } from '../transport/wire';
const OpenFin_Installer: string = 'OpenFinInstaller.exe';

function copyInstaller(config: NewConnectConfig, Installer_Work_Dir: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const outf: string = path.join(Installer_Work_Dir, OpenFin_Installer);
        if (! await exists(outf)) {
            const rd = fs.createReadStream(path.join(__dirname, '..', '..', 'resources', 'win', OpenFin_Installer));
            const wr = fs.createWriteStream(outf);
            wr.on('error', (err: Error) => reject(err));
            wr.on('finish', () => {
                resolve(outf);
            });
            rd.pipe(wr);
        }
        resolve(outf);
    });
}

function launchRVM(config: NewConnectConfig, manifestLocation: string, namedPipeName: string, installer: string): ChildProcess {
    const runtimeArgs = `--runtime-arguments=--runtime-information-channel-v6=${namedPipeName}`;
    const installerArgs: Array<string> = [];
    if (config.installerUI !== true) {
        installerArgs.push('--no-installer-ui');
    }
    installerArgs.push(`--config=${manifestLocation}`);
    installerArgs.push(runtimeArgs);
    if (config.assetsUrl) {
        installerArgs.push(`--assetsUrl=${config.assetsUrl}`);
    }
    return spawn(installer, installerArgs);
}

// tslint:disable-next-line:max-line-length
export default async function launch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string, Installer_Work_Dir: string): Promise<ChildProcess> {
    const installer = await copyInstaller(config, Installer_Work_Dir);
    const rvm = await launchRVM(config, manifestLocation, namedPipeName, installer);
    return new Promise<ChildProcess>((resolve, reject) => {
        rvm.stderr.on('data', err => reject(err));
        rvm.on('exit', () => resolve(rvm));
    });
}
