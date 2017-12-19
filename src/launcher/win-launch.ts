import * as fs from 'fs';
import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import { NewConnectConfig } from '../transport/wire';
import { setTimeout } from 'timers';

const OpenFin_Installer: string = 'OpenFinInstaller.exe';
interface SharedDownloads {
    [key: string]: Promise<string>;
}

const downloads: SharedDownloads = {};

function copyInstaller(config: NewConnectConfig, Installer_Work_Dir: string): Promise<string> {
    if (!downloads[Installer_Work_Dir]) {
        console.log('copying installer')
        downloads[Installer_Work_Dir] = new Promise((resolve, reject) => {
            const rd = fs.createReadStream(path.join(__dirname, '..', '..', 'resources', 'win', OpenFin_Installer));
            const outf: string = path.join(Installer_Work_Dir, OpenFin_Installer);
            const wr = fs.createWriteStream(outf);
            wr.on('error', (err: Error) => reject(err));
            wr.on('finish', () => {
                resolve();
            });
            rd.pipe(wr);
        });
    } else {
        downloads[Installer_Work_Dir] = downloads[Installer_Work_Dir].then((x: string) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(x), 1000);
            });
        });
    }
    return downloads[Installer_Work_Dir];
}

function launchRVM(config: NewConnectConfig, manifestLocation: string, namedPipeName: string, Installer_Work_Dir: string): ChildProcess {
    const installer: string = path.join(Installer_Work_Dir, OpenFin_Installer);
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
    const exe = spawn(installer, installerArgs);
    console.log(`spawning ${installer} ${installerArgs.join('')}`);
    return exe;
}

// tslint:disable-next-line:max-line-length
export default function launch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string, Installer_Work_Dir: string): Promise<ChildProcess> {
    return copyInstaller(config, Installer_Work_Dir)
        .then(() => {
            return launchRVM(config, manifestLocation, namedPipeName, Installer_Work_Dir);
        });
}
