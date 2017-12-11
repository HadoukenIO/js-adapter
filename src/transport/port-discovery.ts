// tslint:disable:no-console
import * as crypto from'crypto';
import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';
import * as path from 'path';
import * as os from 'os';
import { ConnectConfig } from './wire';
import Launcher from '../launcher/launcher';
import Timer = NodeJS.Timer;
import { ChildProcess } from 'child_process';

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
        return config.runtime.version === message.requestedVersion && !message.securityRealm;
    } else {
        return false;
    }
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
            runtimeArgs = runtimeArgs.concat(` ${launcher.Security_Realm_Config_Key}${config.runtime.securityRealm} `);
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
        let helloPayload: number = readUint32(data, MessageHeaderSize);
        if (helloPayload === 0) { //need to read again on unix
            header.extraInteger = true;
            helloPayload = readUint32(data, MessageHeaderSize + 4);
        }
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
    header.routing_id   = readUint32(data, 4);
    header.message_type = readUint32(data, 8);
    header.flags        = readUint32(data, 12);
    header.attachment_count = readUint32(data, 16);
    console.log(`Received header ${header.message_type}`);
    return header;
}

function writeHelloMessage(header: ChromiumMessageHeader, conn: net.Socket): void {
    const data: Buffer = Buffer.alloc(MessageHeaderSize +  (header.extraInteger ? 28 : 4));
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
        this.savedConfig = Object.assign({}, config);
    }

    public retrievePort(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.savedConfig.timeout) {
                this.timeoutTimer = setTimeout(() => {
                    reject(new Error('Port discovery timed out'));
                    this.cleanup();
                }, this.savedConfig.timeout * 1000);
            }
            this.createManifest()
                .then(() => this.createDiscoveryNamedPipe())
                .then(() => {
                    const mPromise: Promise<PortDiscoveryMessage> = this.listenDiscoveryMessage();
                    launcher.launch(this.savedConfig, this.manifestLocation, this.namedPipeName)
                       .then((openfin: ChildProcess) => {
                           openfin.on('error', err => reject(err));
                           if (this.savedConfig.runtime.verboseLogging) {
                            openfin.stdout.pipe(process.stdout);
                            openfin.stderr.pipe(process.stderr);
                           }
                        })
                       .catch(err => reject(err));
                    mPromise.then((msg: PortDiscoveryMessage) => {
                        if (matchRuntimeInstance(this.savedConfig, msg)) {
                            console.log(`Port discovery returns ${msg.port}`);
                            resolve(msg.port);
                            this.cleanup();
                        }
                    }).catch(e => reject(e));
                })
                .catch(reason => {
                    console.log('caught in retrieve port');
                    console.error(reason);
                    reject(reason);
                    this.cleanup();
                });
        }).catch(err => {
            console.error(err);
            console.log('caught error in port discover');
            return false;
        });
    }

    private createDiscoveryNamedPipe(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.discoverState = DiscoverState.INIT;
            let unix = false;
            const randomNum: string = crypto.randomBytes(16).toString('hex');
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
                console.log(`listening to ${this.namedPipeServer.address()}`);
                if (unix) {
                    //On unix using a named socket, address will always be a string
                    const address : string|{port: number, family: string, address: string} = this.namedPipeServer.address();
                    this.namedPipeName = address.address || address;
                    fs.chmodSync(pipePath, 0o777);
                }
                resolve();
            });
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
                                        const index: number = parsed.runtime.arguments.indexOf(launcher.Security_Realm_Config_Key);
                                        if (index > 0) {
                                            parsed.runtime.arguments.split(' ').forEach((value: string) => {
                                                if (value.startsWith(launcher.Security_Realm_Config_Key)) {
                                                    const realm = value.substring(launcher.Security_Realm_Config_Key.length);
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
                try {
                    fs.mkdirSync(launcher.Installer_Work_Dir);
                } catch (e) {
                    if (!e.message.includes('file already exists')) {
                        reject(`Error creating work directory ${e.message}`);
                        return;
                    }
                }
                this.manifestLocation = path.join(launcher.Installer_Work_Dir, manifestFileName);
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
