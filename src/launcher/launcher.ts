import * as os from 'os';
import * as path from 'path';
import winLaunch from './win-launch';
import macLaunch, { OsConfig } from './nix-launch';
import { ChildProcess } from 'child_process';
import { NewConnectConfig } from '../transport/wire';

export default class Launcher {
    private os: string;
    public OpenFin_Installer: string = 'OpenFinInstaller.exe';
    public Installer_Work_Dir: string = path.join(os.tmpdir(), 'openfinnode');
    public Security_Realm_Config_Key: string = '--security-realm=';
    public nixConfig?: any;

    constructor() {
        this.os = os.platform();
        if (this.os !== 'win32') {
            if (this.os === 'darwin') {
                this.nixConfig = {
                    urlPath: 'mac/x64',
                    executablePath: 'OpenFin.app/Contents/MacOS/OpenFin'
                };
            } else if (this.os === 'linux') {
                this.nixConfig = {
                    urlPath: `linux/${os.arch()}`,
                    executablePath: 'openfin'
                };
            } else {
                throw new Error(`Launching not supported on ${this.os}`);
            }
        }
    }

    public launch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string): Promise<ChildProcess> {
        if (this.os === 'win32') {
            return this.winLaunch(config, manifestLocation, namedPipeName);
        } else if (this.os === 'darwin') {
            const osConf: OsConfig = {
                manifestLocation,
                namedPipeName,
                ...this.nixConfig
            };
            return this.macLaunch(config, osConf);
        } else if (this.os === 'linux') {
            const osConf: OsConfig = {
                manifestLocation,
                namedPipeName,
                urlPath: `linux/${os.arch()}`,
                executablePath: 'openfin',
                ...this.nixConfig
            };
            return this.macLaunch(config, osConf);
        } else {
            throw new Error(`Launching not supported on ${this.os}`);
        }
    }

    public static IS_SUPPORTED(): boolean {
        const platform = os.platform();
        return platform === 'win32' || platform === 'darwin' || os.platform() === 'linux';
    }

    private macLaunch(config: NewConnectConfig, osConfig: OsConfig) {
        return macLaunch(config, osConfig);
    }

    private winLaunch(config: NewConnectConfig, manifestLocation: string, namedPipeName: string) {
        return winLaunch(config, manifestLocation, namedPipeName, this.Installer_Work_Dir);
    }
}
