import * as os from 'os';
import * as path from 'path';
import winLaunch from './win-launch';
import macLaunch from './mac-launch';
import { ChildProcess } from 'child_process';
import { NewConnectConfig } from '../transport/wire';

export default class Launcher {
    private os: string;
    public OpenFin_Installer: string = 'OpenFinInstaller.exe';
    public Installer_Work_Dir: string = path.join(os.tmpdir(), 'openfinnode');
    public Security_Realm_Config_Key: string = '--security-realm=';

    constructor() {
        this.os = os.platform();
    }

    public launch (config: NewConnectConfig, manifestLocation: string, namedPipeName: string): Promise<ChildProcess> {
        if (this.os === 'win32') {
            return this.winLaunch(config, manifestLocation, namedPipeName);
        } else if (this.os === 'darwin') {
            return this.macLaunch(config, manifestLocation, namedPipeName);
        } else {
            throw new Error(`Launching not supported on ${this.os}`);
        }
    }

    public static IS_SUPPORTED () : boolean {
        const platform = os.platform();
        return platform === 'win32' || platform === 'darwin';
    }

    private macLaunch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string) {
        return macLaunch(config, manifestLocation, namedPipeName);
    }

    private winLaunch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string) {
        return winLaunch(config, manifestLocation, namedPipeName, this.Installer_Work_Dir);
    }
}