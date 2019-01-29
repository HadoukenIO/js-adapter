import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import { ConfigWithRuntime } from '../transport/wire';
import { exists } from './util';

function launchRVM(config: ConfigWithRuntime, manifestLocation: string, namedPipeName: string, rvm: string): ChildProcess {
    const runtimeArgs = `--runtime-arguments=--runtime-information-channel-v6=${namedPipeName}`;
    const rvmArgs: Array<string> = [];
    if (config.installerUI !== true) {
        rvmArgs.push('--no-ui');
    }
    rvmArgs.push(`--config=${manifestLocation}`);
    rvmArgs.push(runtimeArgs);
    if (config.runtime.rvmDir) {
        rvmArgs.push(`--working-dir=${config.runtime.rvmDir}`);
    } if (config.assetsUrl) {
        rvmArgs.push(`--assetsUrl=${config.assetsUrl}`);
    }
    return spawn(rvm, rvmArgs, { stdio: ['pipe', 'ignore', 'pipe'] });
}

async function checkRvmPath() {
    let rvmPath: string = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'OpenFinRVM.exe');

    if (! await exists(rvmPath)) {
        rvmPath = path.join(__dirname, '..', '..', 'resources', 'win', 'OpenFinRVM.exe');
    }

    return rvmPath;
}

const checkRVM = makeQueued(checkRvmPath);

// tslint:disable-next-line:max-line-length
export default async function launch(config: ConfigWithRuntime, manifestLocation: string, namedPipeName: string): Promise<ChildProcess> {
    const rvmPath = await checkRVM();
    return await launchRVM(config, manifestLocation, namedPipeName, rvmPath);
}

function makeQueued<R, T extends (...args: any[]) => Promise<R>>(func: T): T {
    let initial: Promise<R>;
    return async function (...args: any[]): Promise<R> {
        const x: Promise<R | void> = initial || Promise.resolve();
        initial = x
            .then(() => new Promise<void>((resolve, reject) => setImmediate(() => resolve())))
            .then(() => func(...args))
            .catch(() => func(...args));
        return initial;
        // tslint:disable-next-line:prefer-type-cast no-function-expression
    } as T;
}