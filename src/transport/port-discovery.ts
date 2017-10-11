
import * as crypto from'crypto';
import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';
import {ConnectConfig} from './transport';
const { spawn } = require('child_process');
const OpenFin_Installer: string = 'OpenFinInstaller.exe';
const Installer_Work_Dir = path.join(process.env.TEMP, 'openfinode');
let namedPipeName: string;
let manifestFileName: string;

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

// second message from Runtime
interface ChromiumStringMessage {
    header: ChromiumMessageHeader;
    string_length: number;  // uint32
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
let discoverState: DiscoverState;

export function discoverPort(config: ConnectConfig): Promise<number> {
    return new Promise((resolve, reject) => {
            copyInstaller(config).then(() => createManifest(config))
            .then(() => createDiscoveryNamedPipe(config))
            .then((namedPipeServer) => {
                const mPromise: Promise<PortDiscoveryMessage> = listenDiscoveryMessage(namedPipeServer);
                launchInstaller(config);
                mPromise.then((msg: PortDiscoveryMessage) => {
                    if (matchRuntimeInstance(config, msg)) {
                        console.log(`Port discovery returns ${msg.port}`);
                        resolve(msg.port);
                    }
                });
            })
            .catch(reject);
    });
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
        fs.mkdirSync(Installer_Work_Dir);
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

function createManifest(config: ConnectConfig): Promise<string> {
    return new Promise((resolve, reject) => {
        manifestFileName = 'NodeAdapter-' + config.uuid.replace(/ /g, '-') + '.json';
        const outf: string = path.join(Installer_Work_Dir, manifestFileName);
        console.log(`Creating manifest ${outf}`);
        const wr = fs.createWriteStream(outf);
        const manifest = generateManifest(config);
        wr.on('error', (err: Error) => reject(err));
        wr.on('finish', () => {
            console.log(`created ${outf}`);
            resolve();
        });
        console.log(`creating ${outf}`);
        wr.write(JSON.stringify(manifest), () => {
            wr.end();
        });
    });
}

function generateManifest(config: ConnectConfig): any {
    const manifest = Object.assign({},
        {devtools_port: config.devToolsPort},
                {lrsUrl: config.lrsUrl},
                {assetsUrl: config.assetsUrl},
                {licenseKey: config.licenseKey},
                {appAssets: config.appAssets});
    if (config.runtime) {
        let runtimeArgs: string = '';
        manifest.runtime = Object.assign({}, {version: config.runtime.version,
                                            fallbackVersion: config.runtime.fallbackVersion});
        if (config.runtime.securityRealm) {
            runtimeArgs = runtimeArgs.concat(` --security-realm=${config.runtime.securityRealm} `);
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

function createDiscoveryNamedPipe(config: ConnectConfig): Promise<net.Server> {
    return new Promise((resolve, reject) => {
        discoverState = DiscoverState.INIT;
        const randomNum: string = crypto.randomBytes(16).toString('hex');
        namedPipeName = 'NodeAdapter.' + randomNum;
        const namedPipe: net.Server = net.createServer();
        const pipePath: string = path.join('\\\\.\\pipe\\', 'chrome.' + namedPipeName);
        console.log(`listening to ${pipePath}`);
        namedPipe.listen(pipePath);
        resolve(namedPipe);
    });
}

function listenDiscoveryMessage(namedPipeServer: net.Server): Promise<PortDiscoveryMessage> {
    return new Promise((resolve, reject) => {
        namedPipeServer.on('connection', (conn: net.Socket) => {
            console.log(`named pipe connected ${JSON.stringify(conn.address())}`);
            conn.on('data', (data: Buffer) => {
                console.log(`onData from named pipe ${data.length}`);
                if (discoverState === DiscoverState.INIT) {
                    onRuntimeHello(data, conn);
                    discoverState = DiscoverState.HELLO;
                } else if (discoverState === DiscoverState.HELLO) {
                    const msg = onDiscoverMessage(data);
                    if (msg) {
                        resolve(msg);
                    }
                }
            });
            conn.on('error', err => reject(err));
        });
        namedPipeServer.on('error', err => reject(err));
    });
}

function launchInstaller(config: ConnectConfig) {
    const installer: string = path.join(Installer_Work_Dir, OpenFin_Installer);
    const manifest: string = path.join(Installer_Work_Dir, manifestFileName);
    const runtimeArgs = `--runtime-arguments=--v=1 --runtime-information-channel-v6=${namedPipeName}`;
    console.log(`launching ${installer} --config=${manifest} ${runtimeArgs}`);
    const exe = spawn(installer, [`--config=${manifest}`, runtimeArgs]);
    exe.stdout.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
    });
    exe.stderr.on('data', (data: string) => {
        console.log(`stderr: ${data}`);
    });
    exe.on('error', (err: Error) => console.error(err));
}

function onRuntimeHello(data: Buffer, conn: net.Socket): void {
    const header: ChromiumMessageHeader = readHeader(data);
    if (header.message_type === ChromiumMessageType.RUNTIME_HELLO_MESSAGE) {
        const helloPayload: number = readUint32(data, MessageHeaderSize);
        console.log(`Hello payload ${helloPayload}`);  // supposed to be pid of Runtime
        writeHelloMessage(header, conn);
        discoverState = DiscoverState.HELLO;
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
    const value: number = data.readInt32LE(offset);
    console.log(`Reading ${value} at ${offset}`);
    return value;
}

function writeUint32(data: Buffer, value: number, offset: number): void {
    console.log(`Writing ${value} at ${offset}`);
    data.writeInt32LE(value, offset);
}
