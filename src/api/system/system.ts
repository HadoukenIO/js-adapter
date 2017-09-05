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
 * Identity interface
 * @typedef { Object } Identity
 * @property { string } name The name of the application
 * @property { string } uuid The uuid of the application
*/

/**
 * ProxyConfig interface
 * @typedef { Object } ProxyConfig
 * @property { numder } proxyPort The port number of the running application
 * @property { string } proxyAddress The address of the running application
 * @property { string } type
 */

/**
 * TerminateExternalRequestType interface
 * @typedef { Object } TerminateExternalRequestType
 * @property { string } uuid The uuid of the running application
 * @property { number } timeout Time out period before the running application terminates
 * @property { boolean } kiltree Value to terminate the running application
 */

/**
 * GetLogRequestType interface
 * @typedef { Object } GetLogRequestType
 * @property { string } name The name of the running application
 * @property { number } endFile The file length of the log file
 * @property { number } sizeLimit The set size limit of the log file
 */

/**
 * ExternalProcessRequestType interface
 * @typedef { Object } ExternalProcessRequestType
 * @property { string } path The file path to where the running application resides
 * @property { string } argument The argument passed to the running application
 * @property { Object } LaunchExternalProcessListner This is described in the {LaunchExternalProcessListner} type definition
 */

/**
 * An object representing the core of OpenFin Runtime. Allows the developer
 * to perform system-level actions, such as accessing logs, viewing processes,
 * clearing the cache and exiting the runtime.
 * @namespace
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

    /**
     * Returns the version of the runtime. The version contains the major, minor,
     * build and revision numbers.
     * @return {Promise.<string>}
    */
    public getVersion(): Promise<string> {
        return this.wire.sendAction('get-version')
            .then(({ payload }) => payload.data);
    }

    /**
     * Clears cached data containing window state/positions, application resource
     * files (images, HTML, JavaScript files), cookies, and items stored in the
     * Local Storage.
     * @return {Promise.<void>}
    */
    public clearCache(): Promise<void> {
        return this.wire.sendAction('clear-cache').then(() => undefined);
    }

    /**
     * Clears all cached data when OpenFin Runtime exits.
     * @return {Promise.<void>}
    */
    public deleteCacheOnExit(): Promise<void> {
        return this.wire.sendAction('delete-cache-request').then(() => undefined);
    }

    /**
     * Retrieves an array of data (name, ids, bounds) for all application windows.
     * @return {Promise.Array.<WindowInfo>}
    */
    public getAllWindows(): Promise<Array<WindowInfo>> {
        return this.wire.sendAction('get-all-windows')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array of data for all applications.
     * @tutorial System.getAllApplications
     * @return {Promise.Array.<ApplicationInfo>}
    */
    public getAllApplications(): Promise<Array<ApplicationInfo>> {
        return this.wire.sendAction('get-all-applications')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the command line argument string that started OpenFin Runtime.
     * @return {Promise.<string>}
    */
    public getCommandLineArguments(): Promise<string> {
        return this.wire.sendAction('get-command-line-arguments')
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns a hex encoded hash of the mac address and the currently logged in user name
     * @return {Promise.<string>}
    */
    public getDeviceId(): Promise<string> {
        return this.wire.sendAction('get-device-id')
            .then(({ payload }) => payload.data);
    }

    /**
     * Gets the value of a given environment variable on the computer on which the runtime is installed
     * @return {Promise.<string>}
    */
    public getEnvironmentVariable(): Promise<string> {
        return this.wire.sendAction('get-environment-variable')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the contents of the log with the specified filename.
     * @param { GetLogRequestType } options A object that id defined by the GetLogRequestType interface
     * @return {Promise.<string>}
    */
    public getLog(options: GetLogRequestType): Promise<string> {
        return this.wire.sendAction('view-log', options)
            .then(({ payload }) => payload.data);
    }

    /**
      Retrieves an array containing information for each log file.
      @return {Promise.Array<LogInfo>}
    */
    public getLogList(): Promise<Array<LogInfo>> {
        return this.wire.sendAction('list-logs')
            .then(({ payload }) => payload.data);
    }

    /**
      Retrieves an object that contains data about the monitor setup of the
      computer that the runtime is running on.
      @return {Promise.<MonitorInfo>}
    */
    public getMonitorInfo(): Promise<MonitorInfo> {
        return this.wire.sendAction('get-monitor-info')
            .then(({ payload }) => payload.data);
    }

    /**
      Returns the mouse in virtual screen coordinates (left, top).
      @return {Promise.<PointTopLeft>}
    */
    public getMousePosition(): Promise<PointTopLeft> {
        return this.wire.sendAction('get-mouse-position')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array of all of the runtime processes that are currently
     * running. Each element in the array is an object containing the uuid
     * and the name of the application to which the process belongs.
     * @return {Promise.Array.<ProcessInfo>}
    */
    public getProcessList(): Promise<Array<ProcessInfo>> {
        return this.wire.sendAction('process-snapshot')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the Proxy settings.
     * @return {Promise.<ProxyInfo>}
    */
    public getProxySettings(): Promise<ProxyInfo> {
        return this.wire.sendAction('get-proxy-settings')
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns information about the running RVM in an object.
     * @return {Promise.<RVMInfo>}
    */
    // incompatible with standalone node process.
    public getRvmInfo(): Promise<RVMInfo> {
        return this.wire.sendAction('get-rvm-info')
            .then(({ payload }) => payload.data);
    }

    /**
     * Runs an executable or batch file.
     * @param { ExternalProcessRequestType } options A object that is defined in the ExternalProcessRequestType interface
     * @return {Promise.<RVMInfo>}
    */
    public launchExternalProcess(options: ExternalProcessRequestType): Promise<RVMInfo> {
        return this.wire.sendAction('launch-external-process', options)
            .then(({ payload }) => payload.data);
    }

    /**
     * Monitors a running process.
     * @param { number } pid See tutorial for more details
     * @return {Promise.<Identity>}
    */
    public monitorExternalProcess(pid: number): Promise<Identity> {
        return this.wire.sendAction('monitor-external-process', { pid })
            .then(({ payload }) => payload.data);
    }

    /**
     * Writes the passed message into both the log file and the console.
     * @param { string } level The log level for the entry. Can be either "info", "warning" or "error"
     * @param { string } message The log message text
     * @return {Promise.<void>}
    */
    public log(level: string, message: string): Promise<void> {
        return this.wire.sendAction('write-to-log', { level, message }).then(() => undefined);
    }

    /**
     * Opens the passed URL in the default web browser.
     * @param { string } url The URL to open
     * @tutorial System.openUrlWidthBrowser
     * @return {Promise.<void>}
    */
    public openUrlWithBrowser(url: string): Promise<void> {
        return this.wire.sendAction('open-url-with-browser', { url }).then(() => undefined);
    }
    /**
     * Removes the process entry for the passed UUID obtained from a prior call
     * of fin.desktop.System.launchExternalProcess().
     * @param { string } uuid The UUID for a process obtained from a prior call to fin.desktop.System.launchExternalProcess()
     * @return {Promise.<void>}
    */
    public releaseExternalProcess(uuid: string): Promise<void> {
        return this.wire.sendAction('release-external-process', { uuid }).then(() => undefined);
    }

    /**
     * Shows the Chromium Developer Tools for the specified window
     * @param { Identity } identity This is a object that is defined by the Identity interface
     * @return {Promise.<void>}
    */
    public showDeveloperTools(identity: Identity): Promise<void> {
        return this.wire.sendAction('show-developer-tools', identity).then(() => undefined);
    }

    /**
     * Attempt to close an external process. The process will be terminated if it
     * has not closed after the elapsed timeout in milliseconds.
     * @param { TerminateExternalRequestType } options A object defined in the TerminateExternalRequestType interface
     * @return {Promise.<void>}
    */
    public terminateExternalProcess(options: TerminateExternalRequestType): Promise<void> {
        return this.wire.sendAction('terminate-external-process', options)
            .then(() => undefined);
    }

    /**
     * Update the OpenFin Runtime Proxy settings.
     * @param { ProxyConfig } options A config object defined in the ProxyConfig interface
     * @return {Promise.<void>}
    */
    public updateProxySettings(options: ProxyConfig): Promise<void> {
        return this.wire.sendAction('update-proxy', options).then(() => undefined);
    }

    /**
     * Downloads the given application asset
     * @param { Object } appAsset App asset object
     * @return {Promise.<void>}
    */
    // incompatible with standalone node process.
    public downloadAsset(appAsset: DownloadAssetRequestType): Promise<void> {
        return this.wire.sendAction('download-asset', appAsset).then(() => undefined);
    }

    /**
     * Retrieves an array of data (name, ids, bounds) for all application windows.
     * @return {Promise.Array.<Identity>}
    */
    public getAllExternalApplications(): Promise<Array<Identity>> {
        return this.wire.sendAction('get-all-external-applications')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the UUID of the computer on which the runtime is installed
     * @param { string } uuid The uuid of the running application
     * @return {Promise.<Entity>}
    */
    public resolveUuid(uuid: string): Promise<Entity> {
        return this.wire.sendAction('resolve-uuid', {
            entityKey: uuid
        }).then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array of data for all external applications
     * @param { Identity } requestingIdentity This object is described in the Identity typedef
     * @param { any } data Any data type to pass to the method
     * @return {Promise.<any>}
    */
    public executeOnRemote(requestingIdentity: Identity, data: any): Promise<any> {
        data.requestingIdentity = requestingIdentity;
        return this.wire.ferryAction(data);
    }
}
