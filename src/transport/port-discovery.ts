import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';
import * as os from 'os';
import { NewConnectConfig, PortDiscoveryConfig, isExternalConfig } from './wire';
import Launcher from '../launcher/launcher';
import Timer = NodeJS.Timer;
import { setTimeout } from 'timers';
import { Environment } from '../environment/environment';

const launcher = new Launcher();

// header for messages from Runtime
interface ChromiumMessageHeader {
    payload_size: number;   // uint32
    routing_id: number;     // uint32
    message_type: number;   // uint32
    flags: number;          // uint32
    attachment_count: number;   // uint32
    extraInteger?: boolean;  // for unix
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
    RUNTIME_HELLO_MESSAGE = Math.pow(2, 16) - 1,  // UINT16_MAX
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

function matchRuntimeInstance(config: PortDiscoveryConfig, message: PortDiscoveryMessage): boolean {
    const args = config.runtime.arguments || '';
    const realm = config.runtime.securityRealm || (args.split('--security-realm=')[1] || '').split(' ')[0];
    if (config.runtime.version && realm) {
        return config.runtime.version === message.requestedVersion &&
            realm === message.securityRealm;
    } else if (config.runtime.version) {
        return config.runtime.version === message.requestedVersion && !message.securityRealm;
    } else {
        return false;
    }
}

function generateManifest(config: NewConnectConfig): any {
    const manifest = Object.assign({},
        { devtools_port: config.devToolsPort },
        { startup_app: config.startupApp },
        { lrsUrl: config.lrsUrl },
        { assetsUrl: config.assetsUrl },
        { licenseKey: config.licenseKey },
        { appAssets: config.appAssets });
    if (config.runtime) {
        let runtimeArgs: string = '';
        manifest.runtime = Object.assign({}, {
            version: config.runtime.version,
            fallbackVersion: config.runtime.fallbackVersion
        });
        if (config.runtime.securityRealm) {
            runtimeArgs = runtimeArgs.concat(`${launcher.Security_Realm_Config_Key}${config.runtime.securityRealm} `);
        }
        if (config.runtime.verboseLogging === true) {
            runtimeArgs = runtimeArgs.concat('--v=1  --attach-console ');
        }
        if (config.runtime.arguments) {
            runtimeArgs = runtimeArgs.concat(`${config.runtime.arguments}`);
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
        let helloPayload: number = readUint32(data, MessageHeaderSize);
        if (helloPayload === 0) { //need to read again on unix
            header.extraInteger = true;
            helloPayload = readUint32(data, MessageHeaderSize + 4);
        }
        writeHelloMessage(header, conn);
    } else {
        console.error(`Invalid port discovery hello message type ${header.message_type}`);
    }
}

function onDiscoverMessage(data: Buffer): PortDiscoveryMessage {
    const header: ChromiumMessageHeader = readHeader(data);
    if (header.message_type === ChromiumMessageType.RUNTIME_STRING_MESSAGE) {
        const strLength: number = readUint32(data, MessageHeaderSize); // length of following discovery string
        //BAD CODE
        let msg: string;
        if (os.platform() !== 'win32') {
            const raw = data.toString('utf8');
            const firstBrace = raw.indexOf('{');
            const lastBrace = raw.lastIndexOf('}');
            msg = raw.slice(firstBrace, lastBrace + 1);
        } else {
            ////////Bad code end
            msg = data.toString('utf8', MessageHeaderSize + 4, MessageHeaderSize + 4 + strLength);
        }
        const msg2 = msg.replace(/\\/g, '\\\\');
        const env: PortDiscoveryMessageEnvolope = JSON.parse(msg2);
        if (env.payload) {
            return env.payload;
        } else {
            console.warn('discovery message did not have payload');
        }
    } else {
        console.error(`Invalid port discovery message type ${header.message_type}`);
    }
}

function readHeader(data: Buffer): ChromiumMessageHeader {
    const header: ChromiumMessageHeader = <ChromiumMessageHeader>{};
    header.payload_size = readUint32(data, 0);
    header.routing_id = readUint32(data, 4);
    header.message_type = readUint32(data, 8);
    header.flags = readUint32(data, 12);
    header.attachment_count = readUint32(data, 16);
    return header;
}

function writeHelloMessage(header: ChromiumMessageHeader, conn: net.Socket): void {
    const data: Buffer = Buffer.alloc(MessageHeaderSize + (header.extraInteger ? 28 : 4));
    writeUint32(data, header.payload_size, 0);
    writeUint32(data, header.routing_id, 4);
    writeUint32(data, header.message_type, 8);
    writeUint32(data, header.flags, 12);
    writeUint32(data, header.attachment_count, 16);
    let next = 20;
    if (header.extraInteger) {
        writeUint32(data, 0, next);
        next += 4;
    }
    writeUint32(data, process.pid, next);
    conn.write(data);
}

function readUint32(data: Buffer, offset: number): number {
    return data.readInt32LE(offset);
}

function writeUint32(data: Buffer, value: number, offset: number): void {
    data.writeInt32LE(value, offset);
}

export class PortDiscovery {
    private savedConfig: PortDiscoveryConfig;
    private namedPipeName: string;
    private manifestLocation: string;
    private namedPipeServer: net.Server;
    private pipeConnection: net.Socket; // created by Runtime. only one allowed
    private timeoutTimer: Timer;
    private environment: Environment;

    constructor(config: PortDiscoveryConfig, environment: Environment) {
        this.savedConfig = Object.assign({}, config);
        this.environment = environment;
    }

    // tslint:disable-next-line:no-unused-variable
    public async retrievePort(): Promise<number> {
        try {
            await this.createManifest();
            await this.createDiscoveryNamedPipe();
            const mPromise: Promise<PortDiscoveryMessage> = this.listenDiscoveryMessage();
            const msg = await Promise.race([(async () => {
                const openfin = await launcher.launch(this.savedConfig, this.manifestLocation, this.namedPipeName);
                openfin.on('error', err => { throw err; });
                if (this.savedConfig.runtime.verboseLogging) {
                    openfin.stdout.pipe(process.stdout);
                    openfin.stderr.pipe(process.stderr);
                }
                this.timeoutTimer = setTimeout(() => {
                    //  provide a log to aid in debugging in case of a hanging promise
                    console.warn('Port Discovery is taking a while. Either the runtime is downloading or it failed to retrieve the port.');
                }, 30 * 1000);
                return await mPromise;
            })(), mPromise]);
            if (matchRuntimeInstance(this.savedConfig, msg)) {
                this.cleanup();
                return msg.port;
            } else {
                console.warn('Port Discovery did not match runtime instance');
            }
        } catch (reason) {
            this.cleanup();
            throw reason;
        }
    }

    private createDiscoveryNamedPipe(): Promise<any> {
        return new Promise((resolve, reject) => {
            let unix = false;
            const randomNum: string = this.environment.getRandomId();
            this.namedPipeName = 'NodeAdapter.' + randomNum;
            this.namedPipeServer = net.createServer();
            const pipePath: string = os.platform() === 'win32'
                ? path.join('\\\\.\\pipe\\', 'chrome.' + this.namedPipeName)
                : path.join(os.tmpdir(), this.namedPipeName + '.sock');
            if (os.platform() !== 'win32') {
                unix = true;
                this.namedPipeName = pipePath;
            }
            this.namedPipeServer.listen(pipePath, () => {
                if (unix) {
                    //@ts-ignore On unix using a named socket, address will always be a string @types/node needs update
                    const address: string = this.namedPipeServer.address();
                    this.namedPipeName = address;
                    fs.chmodSync(pipePath, 0o777);
                }
                resolve();
            });
        });
    }

    private listenDiscoveryMessage(): Promise<PortDiscoveryMessage> {
        return new Promise((resolve, reject) => {
            this.namedPipeServer.on('connection', (conn: net.Socket) => {
                    let discoverState = DiscoverState.INIT;
                    conn.on('data', (data: Buffer) => {
                        if (discoverState === DiscoverState.INIT) {
                            onRuntimeHello(data, conn);
                            discoverState = DiscoverState.HELLO;
                        } else if (discoverState === DiscoverState.HELLO) {
                            const msg = onDiscoverMessage(data);
                            if (msg && matchRuntimeInstance(this.savedConfig, msg)) {
                                resolve(msg);
                            } else {
                                console.warn('Received Port Discovery message from unexpected runtime');
                            }
                        }
                    });
            });
            this.namedPipeServer.on('error', err => reject(err));
        });
    }

    private createManifest(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (isExternalConfig(this.savedConfig)) {
                this.manifestLocation = this.savedConfig.manifestUrl;
                resolve();
            } else {
                const manifestFileName = 'NodeAdapter-' + this.savedConfig.uuid.replace(/ /g, '-') + '.json';
                try {
                    fs.mkdirSync(launcher.Installer_Work_Dir);
                } catch (e) {
                    if (!e.message.includes('file already exists')) {
                        reject(new Error(`Error creating work directory ${e.message}`));
                        return;
                    }
                }
                this.manifestLocation = path.join(launcher.Installer_Work_Dir, manifestFileName);
                const wr = fs.createWriteStream(this.manifestLocation);
                const manifest = generateManifest(this.savedConfig);
                wr.on('error', (err: Error) => reject(err));
                wr.on('finish', () => {
                    resolve();
                });
                wr.write(JSON.stringify(manifest), () => {
                    wr.end();
                });
            }
        });
    }

    private cleanup(): void {
        if (this.namedPipeServer) {
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
