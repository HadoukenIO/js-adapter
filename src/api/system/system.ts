import { Base } from '../base';
import { ApplicationInfo } from './application';
import { WindowInfo } from './window';
import { Identity } from '../../identity';
import { MonitorInfo }  from './monitor';
import { PointTopLeft } from './point';
import { GetLogRequestType, LogInfo } from './log';
import { ProxyInfo, ProxyConfig } from './proxy';
import { ProcessInfo } from './process';
import { DownloadAssetRequestType } from './download-asset';
import { RVMInfo } from './rvm';
import { Entity } from './entity';
import { ExternalProcessRequestType , TerminateExternalRequestType } from './external-process';
import Transport from '../../transport/transport';

/**
  @class
*/
export default class System extends Base {

    constructor(wire: Transport) {
        super(wire);

        this.on('removeListener', (eventType:  string) => {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic : this.topic
            }));
        });

        this.on('newListener', (eventType: string) => {
            this.registerEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic : this.topic
            }));
        });

    }

    public getVersion(): Promise<string> {
        return this.wire.sendAction('get-version')
            .then(({ payload }) => payload.data);
    }

    public clearCache(): Promise<void> {
        return this.wire.sendAction('clear-cache').then(() => undefined);
    }

    public deleteCacheOnExit(): Promise<void> {
        return this.wire.sendAction('delete-cache-request').then(() => undefined);
    }

    public getAllWindows(): Promise<Array<WindowInfo>> {
        return this.wire.sendAction('get-all-windows')
            .then(({ payload }) => payload.data);
    }

    public getAllApplications(): Promise<Array<ApplicationInfo>> {
        return this.wire.sendAction('get-all-applications')
            .then(({ payload }) => payload.data);
    }

    public getCommandLineArguments(): Promise<string> {
        return this.wire.sendAction('get-command-line-arguments')
            .then(({ payload }) => payload.data);
    }

    public getDeviceId(): Promise<string> {
        return this.wire.sendAction('get-device-id')
            .then(({ payload }) => payload.data);
    }

    public getEnvironmentVariable(): Promise<string> {
        return this.wire.sendAction('get-environment-variable')
            .then(({ payload }) => payload.data);
    }

    public getLog(options: GetLogRequestType): Promise<string> {
        return this.wire.sendAction('view-log', options)
            .then(({ payload }) => payload.data);
    }

    public getLogList(): Promise<Array<LogInfo>> {
        return this.wire.sendAction('list-logs')
            .then(({ payload }) => payload.data);
    }

    public getMonitorInfo(): Promise<MonitorInfo> {
        return this.wire.sendAction('get-monitor-info')
            .then(({ payload }) => payload.data);
    }

    public getMousePosition(): Promise<PointTopLeft> {
        return this.wire.sendAction('get-mouse-position')
            .then(({ payload }) => payload.data);
    }

    public getProcessList(): Promise<Array<ProcessInfo>> {
        return this.wire.sendAction('process-snapshot')
            .then(({ payload }) => payload.data);
    }

    public getProxySettings(): Promise<ProxyInfo> {
        return this.wire.sendAction('get-proxy-settings')
            .then(({ payload }) => payload.data);
    }

    // incompatible with standalone node process.
    public getRvmInfo(): Promise<RVMInfo> {
        return this.wire.sendAction('get-rvm-info')
            .then(({ payload }) => payload.data);
    }

    public launchExternalProcess(options: ExternalProcessRequestType): Promise<RVMInfo> {
        return this.wire.sendAction('launch-external-process', options)
            .then(({ payload }) => payload.data);
    }

    public monitorExternalProcess(pid: number): Promise<Identity> {
        return this.wire.sendAction('monitor-external-process', { pid })
            .then(({ payload }) => payload.data);
    }

    public log(level: string, message: string): Promise<void> {
        return this.wire.sendAction('write-to-log', { level, message }).then(() => undefined);
    }

    public openUrlWithBrowser(url: string): Promise<void> {
        return this.wire.sendAction('open-url-with-browser', { url }).then(() => undefined);
    }

    public releaseExternalProcess(uuid: string): Promise<void> {
        return this.wire.sendAction('release-external-process', { uuid }).then(() => undefined);
    }

    public showDeveloperTools(identity: Identity): Promise<void> {
        return this.wire.sendAction('show-developer-tools', identity).then(() => undefined);
    }

    public terminateExternalProcess(options: TerminateExternalRequestType): Promise<void> {
        return this.wire.sendAction('terminate-external-process', options)
            .then(() => undefined);
    }

    public updateProxySettings(options: ProxyConfig): Promise<void> {
        return this.wire.sendAction('update-proxy', options).then(() => undefined);
    }

    // incompatible with standalone node process.
    public downloadAsset(appAsset: DownloadAssetRequestType): Promise<void> {
        return this.wire.sendAction('download-asset', appAsset).then(() => undefined);
    }

    public getAllExternalApplications(): Promise<Array<Identity>> {
        return this.wire.sendAction('get-all-external-applications')
            .then(({ payload }) => payload.data);
    }

    public resolveUuid(uuid: string): Promise<Entity> {
        return this.wire.sendAction('resolve-uuid', {
            entityKey: uuid
        }).then(({ payload }) => payload.data);
    }

    public executeOnRemote(requestingIdentity: Identity, data: any): Promise<any> {
        data.requestingIdentity = requestingIdentity;
        return this.wire.ferryAction(data);
    }
}
