import { ChildProcess } from 'child_process';
import { ConnectConfig } from '../transport/wire';

const OpenFin_Installer: string = 'OpenFinInstaller.exe';

function copyInstaller(config: ConnectConfig, Installer_Work_Dir: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const rd = fs.createReadStream(path.join(__dirname, '..', '..', 'resources', 'win', OpenFin_Installer));
        const outf: string = path.join(Installer_Work_Dir, OpenFin_Installer);
        const wr = fs.createWriteStream(outf);
        wr.on('error', (err: Error) => reject(err));
        wr.on('finish', () => {
            console.log(`copied ${outf}`);
            resolve();
        });
        console.log(`copying ${outf}`);
        rd.pipe(wr);
    });
}

function launchInstaller(config: ConnectConfig, manifestLocation: string, namedPipeName: string, Installer_Work_Dir: string): ChildProcess {
    const installer: string = path.join(Installer_Work_Dir, OpenFin_Installer);
    const runtimeArgs = `--runtime-arguments=--runtime-information-channel-v6=${namedPipeName}`;
    const installerArgs: Array<string> = [];
    if (config.installerUI !== true) {
        installerArgs.push('--no-installer-ui');
    }
    installerArgs.push(`--config=${manifestLocation}`);
    installerArgs.push(`${runtimeArgs}`);
    if (config.assetsUrl) {
        installerArgs.push(`--assetsUrl=${config.assetsUrl}`);
    }
    console.log(`launching ${installer} ${installerArgs}`);
    const exe = spawn(installer, installerArgs);
    exe.stdout.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
    });
    exe.stderr.on('data', (data: string) => {
        console.log(`stderr: ${data}`);
    });
    exe.on('error', (err: Error) => console.error(err));
    return exe;
}

// tslint:disable-next-line:max-line-length
export default function launch (config: ConnectConfig, manifestLocation: string, namedPipeName: string, Installer_Work_Dir: string) : Promise<ChildProcess> {
    return copyInstaller(config, Installer_Work_Dir)
        .then( () => launchInstaller(config, manifestLocation, namedPipeName, Installer_Work_Dir));
}