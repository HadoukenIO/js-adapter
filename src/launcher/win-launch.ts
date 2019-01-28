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

// tslint:disable-next-line:max-line-length
export default async function launch(config: ConfigWithRuntime, manifestLocation: string, namedPipeName: string): Promise<ChildProcess> {
    let rvmPath: string = path.resolve(process.env.LOCALAPPDATA, 'OpenFin', 'OpenFinRVM.exe');

    if (! await exists(rvmPath)) {
        rvmPath = path.join(__dirname, '..', '..', 'resources', 'win', 'OpenFinRVM.exe');
    }

    return await launchRVM(config, manifestLocation, namedPipeName, rvmPath);
}
