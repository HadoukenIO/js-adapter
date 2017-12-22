import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import { exists } from './util';
import { NewConnectConfig } from '../transport/wire';
const OpenFin_Installer: string = 'OpenFinInstaller.exe';

async function checkRVMAsync(config: NewConnectConfig, Installer_Work_Dir: string, manifestLocation: string): Promise<string> {
    const rvmPath: string = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'OpenFinRVM.exe');
    if (! await exists(rvmPath)) {
        await new Promise(async (resolve, reject) => {
            const installer = path.join(__dirname, '..', '..', 'resources', 'win', OpenFin_Installer);
            const installing = spawn(installer, [`--config=${manifestLocation}`, '--do-not-launch']);
            installing.on('exit', (code) => {
                resolve();
            });
            installing.on('error', reject);
        });
        if (! await exists(rvmPath)) {
            throw new Error('Failed to install the RVM');
        }
    }
    return rvmPath;
}

function launchRVM(config: NewConnectConfig, manifestLocation: string, namedPipeName: string, rvm: string): ChildProcess {
    const runtimeArgs = `--runtime-arguments=--runtime-information-channel-v6=${namedPipeName}`;
    const rvmArgs: Array<string> = [];
    if (config.installerUI !== true) {
        rvmArgs.push('--no-installer-ui');
    }
    rvmArgs.push(`--config=${manifestLocation}`);
    rvmArgs.push(runtimeArgs);
    if (config.assetsUrl) {
        rvmArgs.push(`--assetsUrl=${config.assetsUrl}`);
    }
    return spawn(rvm, rvmArgs);
}

const checkRVM = makeQueued(checkRVMAsync);

// tslint:disable-next-line:max-line-length
export default async function launch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string, Installer_Work_Dir: string): Promise<ChildProcess> {
    const rvmPath = await checkRVM(config, Installer_Work_Dir, manifestLocation);
    return await launchRVM(config, manifestLocation, namedPipeName, rvmPath);
}

function makeQueued<R, T extends (...args: any[]) => Promise<R>>(func: T): T {
    let initial: Promise<R>;
    return async function(...args: any[]): Promise<R> {
        const x: Promise<R | void> = initial || Promise.resolve();
        initial = x
            .then(() => new Promise<void>((resolve, reject) => setImmediate(() => resolve())))
            .then(() => func(...args))
            .catch(() => func(...args));
        return initial;
    // tslint:disable-next-line:prefer-type-cast no-function-expression
    } as T;
}
