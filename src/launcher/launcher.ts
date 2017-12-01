import * as os from 'os';
import * as path from 'path'
import winLaunch from './win-launch';
import { ChildProcess } from 'child_process';
import { ConnectConfig } from '../transport/wire';

export default class Launcher {
    private os: string;
    public OpenFin_Installer: string = 'OpenFinInstaller.exe';
    public Installer_Work_Dir = path.join(process.env.TEMP, 'openfinode');
    public Security_Realm_Config_Key: string = '--security-realm=';

    constructor() {
        this.os = os.platform();
    }

    public launch (config: ConnectConfig, manifestLocation: string, namedPipeName: string): Promise<ChildProcess> {
        if (os.platform() === 'win32') {
            return this.winLaunch(config, manifestLocation, namedPipeName);
        } else {
            throw new Error(`Launching not supported on ${os.platform()}`);
        }
    }

    private winLaunch(config: any, manifestLocation: string, namedPipeName: string) {
        return winLaunch(config, manifestLocation, namedPipeName, this.Installer_Work_Dir);
    }
}