// tslint:disable:no-console
import * as crypto from'crypto';
import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';
import * as path from 'path';
import { ConnectConfig } from './wire';
import { spawn } from 'child_process';
import * as os from 'os';
import Timer = NodeJS.Timer;

const OpenFin_Installer: string = 'OpenFinInstaller.exe';
const Installer_Work_Dir = path.join(process.env.TEMP, 'openfinode');
const Security_Realm_Config_Key: string = '--security-realm=';

// header for messages from Runtime
interface ChromiumMessageHeader {
    payload_size: number;   // uint32
    routing_id: number;     // uint32
    message_type: number;   // uint32
    flags: number;          // uint32
    attachment_count: number;   // uint32
}
const MessageHeaderSize: number = 20;  // sizeof(ChromiumMessageHeader)

// first message between Runtime and node
interface ChromiumHelloMessage {
    header: ChromiumMessageHeader;
    payload: number;        // uint32, pid of Browser process or node process
}

// second message from Runtime that has port discovery message
interface ChromiumStringMessage {
    header: ChromiumMessageHeader;
    string_length: number;  // uint32, length of data
    data: string;           // port discover message
}

// value for message_type
enum ChromiumMessageType {
    RUNTIME_HELLO_MESSAGE = Math.pow( 2, 16 ) - 1,  // UINT16_MAX
    RUNTIME_STRING_MESSAGE = 0
}

enum DiscoverState {
    INIT = 0,
    HELLO,
    PORT_MESSAGE
}

interface PortDiscoveryMessage {
    version: string;
    requestedVersion: string;
    securityRealm?: string;
    port: number;
}
interface PortDiscoveryMessageEnvolope {
    action: string;
    payload: PortDiscoveryMessage;
}

function matchRuntimeInstance(config: ConnectConfig, message: PortDiscoveryMessage): Boolean {
    if (config.runtime.version && config.runtime.securityRealm) {
        return config.runtime.version === message.requestedVersion &&
            config.runtime.securityRealm === message.securityRealm;
    } else if (config.runtime.version) {
        return config.runtime.version === message.version && !message.securityRealm;
    } else {
        return false;
    }
}

function copyInstaller(config: ConnectConfig): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            fs.mkdirSync(Installer_Work_Dir);
        } catch (e) {
            if (!e.message.includes('file already exists')) {
                reject(`Error creating work directory ${e.message}`);
                return;
            }
        }
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

function generateManifest(config: ConnectConfig): any {
    const manifest = Object.assign({},
        {devtools_port: config.devToolsPort},
                {startup_app: config.startupApp},
                {lrsUrl: config.lrsUrl},
                {assetsUrl: config.assetsUrl},
                {licenseKey: config.licenseKey},
                {appAssets: config.appAssets});
    if (config.runtime) {
        let runtimeArgs: string = '';
        manifest.runtime = Object.assign({}, {version: config.runtime.version,
                                            fallbackVersion: config.runtime.fallbackVersion});
        if (config.runtime.securityRealm) {
            runtimeArgs = runtimeArgs.concat(` ${Security_Realm_Config_Key}${config.runtime.securityRealm} `);
        }
        if (config.runtime.verboseLogging === true) {
            runtimeArgs = runtimeArgs.concat(' --v=1 ');
        }
        if (config.runtime.additionalArgument) {
            runtimeArgs = runtimeArgs.concat(` ${config.runtime.additionalArgument} `);
        }
        manifest.runtime.arguments = runtimeArgs;
    }
    if (config.customItems) {
        config.customItems.forEach((value) => {
            Object.assign(manifest, value);
        });
    }
    return manifest;
}

function onRuntimeHello(data: Buffer, conn: net.Socket): void {
    const header: ChromiumMessageHeader = readHeader(data);
    if (header.message_type === ChromiumMessageType.RUNTIME_HELLO_MESSAGE) {
        const helloPayload: number = readUint32(data, MessageHeaderSize);
        console.log(`Hello payload ${helloPayload}`);  // supposed to be pid of Runtime
        writeHelloMessage(header, conn);
    } else {
        console.error(`Invalid port discovery hello message type ${header.message_type}`);
    }
}

function onDiscoverMessage(data: Buffer): PortDiscoveryMessage {
    const header: ChromiumMessageHeader = readHeader(data);
    if (header.message_type === ChromiumMessageType.RUNTIME_STRING_MESSAGE) {
        const strLength: number = readUint32(data, MessageHeaderSize); // length of following discovery string
        console.log(`discovery message length ${strLength}`);
        let msg: string = data.toString('utf8', MessageHeaderSize + 4, MessageHeaderSize + 4 + strLength);
        console.log(`discovery message ${msg}`);
        msg = msg.replace(/\\/g, '\\\\');
        const env: PortDiscoveryMessageEnvolope = JSON.parse(msg);
        if (env.payload) {
            return env.payload;
        }
    } else {
        console.error(`Invalid port discovery message type ${header.message_type}`);
    }
}

function readHeader(data: Buffer): ChromiumMessageHeader {
    const header: ChromiumMessageHeader = <ChromiumMessageHeader>{};
    header.payload_size = readUint32(data, 0);
    header.routing_id   = readUint32(data, 4);
    header.message_type = readUint32(data, 8);
    header.flags        = readUint32(data, 12);
    header.attachment_count = readUint32(data, 16);
    console.log(`Received header ${header.message_type}`);
    return header;
}

function writeHelloMessage(header: ChromiumMessageHeader, conn: net.Socket): void {
    console.log(`Writing hello message ${process.pid}`);
    const data: Buffer = Buffer.alloc(MessageHeaderSize + 4);
    writeUint32(data, header.payload_size, 0);
    writeUint32(data, header.routing_id, 4);
    writeUint32(data, header.message_type, 8);
    writeUint32(data, header.flags, 12);
    writeUint32(data, header.attachment_count, 16);
    writeUint32(data, process.pid, 20);
    conn.write(data, () => {
        console.log(`Finished writing hello message ${conn.bytesWritten}`);
    });
}

function readUint32(data: Buffer, offset: number): number {
    return data.readInt32LE(offset);
}

function writeUint32(data: Buffer, value: number, offset: number): void {
    data.writeInt32LE(value, offset);
}

export class PortDiscovery {
    private savedConfig: ConnectConfig;
    private namedPipeName: string;
    private manifestLocation: string;
    private discoverState: DiscoverState;
    private namedPipeServer: net.Server;
    private pipeConnection: net.Socket; // created by Runtime. only one allowed
    private timeoutTimer: Timer;

    constructor(config: ConnectConfig) {
        if (os.platform() === 'win32') {
            this.savedConfig = Object.assign({}, config);
        } else {
            throw new Error(`Port Discovery not supported on ${os.platform()}`);
        }
    }

    public retrievePort(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.savedConfig.timeout) {
                this.timeoutTimer = setTimeout(() => {
                    reject(new Error('Port discovery timed out'));
                    this.cleanup();
                }, this.savedConfig.timeout * 1000);
            }
            copyInstaller(this.savedConfig).then(() => this.createManifest())
                .then(() => this.createDiscoveryNamedPipe())
                .then(() => {
                    const mPromise: Promise<PortDiscoveryMessage> = this.listenDiscoveryMessage();
                    this.launchInstaller();
                    mPromise.then((msg: PortDiscoveryMessage) => {
                        if (matchRuntimeInstance(this.savedConfig, msg)) {
                            console.log(`Port discovery returns ${msg.port}`);
                            resolve(msg.port);
                            this.cleanup();
                        }
                    });
                })
                .catch(reason => {
                    reject(reason);
                    this.cleanup();
                });
        });
    }

    private createDiscoveryNamedPipe(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.discoverState = DiscoverState.INIT;
            const randomNum: string = crypto.randomBytes(16).toString('hex');
            this.namedPipeName = 'NodeAdapter.' + randomNum;
            this.namedPipeServer = net.createServer();
            const pipePath: string = path.join('\\\\.\\pipe\\', 'chrome.' + this.namedPipeName);
            console.log(`listening to ${pipePath}`);
            this.namedPipeServer.listen(pipePath);
            resolve();
        });
    }

    private listenDiscoveryMessage(): Promise<PortDiscoveryMessage> {
        return new Promise((resolve, reject) => {
            this.namedPipeServer.on('connection', (conn: net.Socket) => {
                console.log(`named pipe connected ${JSON.stringify(conn.address())}`);
                if (!this.pipeConnection) {
                    this.pipeConnection = conn;
                    conn.on('data', (data: Buffer) => {
                        console.log(`onData from named pipe ${data.length}`);
                        if (this.discoverState === DiscoverState.INIT) {
                            onRuntimeHello(data, conn);
                            this.discoverState = DiscoverState.HELLO;
                        } else if (this.discoverState === DiscoverState.HELLO) {
                            const msg = onDiscoverMessage(data);
                            if (msg) {
                                resolve(msg);
                            }
                        }
                    });
                    conn.on('error', err => reject(err));
                } else {
                    console.error('Duplicate pipe connection');
                    conn.end();
                }
            });
            this.namedPipeServer.on('error', err => reject(err));
        });
    }

    private createManifest(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.savedConfig.manifestUrl) {
                console.log(`Retrieving ${this.savedConfig.manifestUrl}`);
                http.get(this.savedConfig.manifestUrl, res => {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Error getting ${this.savedConfig.manifestUrl} status ${res.statusCode}`));
                    } else {
                        res.setEncoding('utf8');
                        let rawData = '';
                        res.on('data', (chunk) => { rawData += chunk; });
                        res.on('end', () => {
                            try {
                                const parsed = JSON.parse(rawData);
                                // Installer needs assetsUrl if set
                                Object.assign(this.savedConfig, {assetsUrl: parsed.assetsUrl});
                                if (parsed.runtime) {
                                    this.savedConfig.runtime = Object.assign({}, {version: parsed.runtime.version});
                                    if (parsed.runtime.arguments) {
                                        const index: number = parsed.runtime.arguments.indexOf(Security_Realm_Config_Key);
                                        if (index > 0) {
                                            parsed.runtime.arguments.split(' ').forEach((value: string) => {
                                                if (value.startsWith(Security_Realm_Config_Key)) {
                                                    const realm = value.substring(Security_Realm_Config_Key.length);
                                                    this.savedConfig.runtime.securityRealm = realm;
                                                    console.log(`Parsed security realm ${realm} from ${this.savedConfig.manifestUrl}`);
                                                }
                                            });
                                        }
                                    }
                                }
                                this.manifestLocation = this.savedConfig.manifestUrl;
                                resolve();
                            } catch (e) {
                                reject(new Error(`Error parsing remote manifest ${e.message}`));
                            }
                        });
                        res.on('error', e => {
                            reject(new Error(`Error getting ${this.savedConfig.manifestUrl} error ${e.message}`));
                        });
                    }
                });
            } else {
                const manifestFileName = 'NodeAdapter-' + this.savedConfig.uuid.replace(/ /g, '-') + '.json';
                this.manifestLocation = path.join(Installer_Work_Dir, manifestFileName);
                console.log(`Creating manifest ${this.manifestLocation}`);
                const wr = fs.createWriteStream(this.manifestLocation);
                const manifest = generateManifest(this.savedConfig);
                wr.on('error', (err: Error) => reject(err));
                wr.on('finish', () => {
                    console.log(`created ${this.manifestLocation}`);
                    resolve();
                });
                console.log(`creating ${this.manifestLocation}`);
                wr.write(JSON.stringify(manifest), () => {
                    wr.end();
                });
            }
        });
    }

    private launchInstaller(): void {
        const installer: string = path.join(Installer_Work_Dir, OpenFin_Installer);
        const runtimeArgs = `--runtime-arguments=--runtime-information-channel-v6=${this.namedPipeName}`;
        const installerArgs: Array<string> = [];
        if (this.savedConfig.installerUI !== true) {
            installerArgs.push('--no-installer-ui');
        }
        installerArgs.push(`--config=${this.manifestLocation}`);
        installerArgs.push(`${runtimeArgs}`);
        if (this.savedConfig.assetsUrl) {
            installerArgs.push(`--assetsUrl=${this.savedConfig.assetsUrl}`);
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
    }

    private cleanup(): void {
        if (this.namedPipeServer) {
            console.log('shutting down named pipe');
            if (this.pipeConnection) {
                this.pipeConnection.end();
            }
            this.namedPipeServer.close();
        }
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
    }
}
