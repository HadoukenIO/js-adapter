import { Base } from '../base';
import { ApplicationInfo } from './application';
import { WindowInfo } from './window';
import { Identity } from '../../identity';
import { MonitorInfo } from './monitor';
import { PointTopLeft } from './point';
import { GetLogRequestType, LogInfo, LogLevel } from './log';
import { ProxyInfo, ProxyConfig } from './proxy';
import { ProcessInfo } from './process';
import { AppAssetInfo, AppAssetRequest, RuntimeDownloadOptions, RuntimeDownloadProgress } from './download-asset';
import { RVMInfo } from './rvm';
import { RuntimeInfo } from './runtime-info';
import { Entity, EntityInfo } from './entity';
import { HostSpecs } from './host-specs';
import { ExternalProcessRequestType , TerminateExternalRequestType, ExternalConnection } from './external-process';
import Transport from '../../transport/transport';
import { CookieInfo, CookieOption } from './cookie';
import { RegistryInfo } from './registry-info';
import { DownloadPreloadOption, DownloadPreloadInfo } from './download-preload';
import { RuntimeError, NotSupportedError } from '../../transport/transport-errors';

/**
 * AppAssetInfo interface
 * @typedef { Object } AppAssetInfo
 * @property { string } src  The URL to a zip file containing the package files (executables, dlls, etc…)
 * @property { string } alias The name of the asset
 * @property { string } version The version of the package
 * @property { string } target Specify default executable to launch. This option can be overridden in launchExternalProcess
 * @property { args } args The default command line arguments for the aforementioned target.
 * @property { boolean } mandatory When set to true, the app will fail to load if the asset cannot be downloaded.
 * When set to false, the app will continue to load if the asset cannot be downloaded. (Default: true)
 */

/**
 * AppAssetRequest interface
 * @typedef { Object } AppAssetRequest
 * @property { string } alias The name of the asset
 */

/**
 * CookieInfo interface
 * @typedef { Object } CookieInfo
 * @property { string } name  The name of the cookie
 * @property { string } domain The domain of the cookie
 * @property { string } path The path of the cookie
 */

/**
 * CookieOption interface
 * @typedef { Object } CookieOption
 * @property { string } name The name of the cookie
 */

/**
 * ExternalConnection interface
 * @typedef { Object } ExternalConnection
 * @property { string } token The token to broker an external connection
 * @property { string } uuid The uuid of the external connection
 */

 /**
 * ExternalProcessRequestType interface
 * @typedef { Object } ExternalProcessRequestType
 * @property { string } path The file path to where the running application resides
 * @property { string } arguments The argument passed to the running application
 * @property { Object } listener This is described in the {LaunchExternalProcessListner} type definition
 */

/**
 * Entity interface
 * @typedef { Object } Entity
 * @property { string } type The type of the entity
 * @property { string } uuid The uuid of the entity
 */

/**
 * EntityInfo interface
 * @typedef { Object } EntityInfo
 * @property { string } name The name of the entity
 * @property { string } uuid The uuid of the entity
 * @property { Identity } parent The parent of the entity
 * @property { string } entityType The type of the entity
 */

 /**
 * GetLogRequestType interface
 * @typedef { Object } GetLogRequestType
 * @property { string } name The name of the running application
 * @property { number } endFile The file length of the log file
 * @property { number } sizeLimit The set size limit of the log file
 */

/**
 * Identity interface
 * @typedef { Object } Identity
 * @property { string } name The name of the application
 * @property { string } uuid The uuid of the application
 */

/**
 * @typedef { verbose | info | warning | error | fatal } LogLevel
 * @summary Log verbosity levels.
 * @desc Describes the minimum level (inclusive) above which logs will be written
 *
 * @property { string } verbose all logs written
 * @property { string } info info and above
 * @property { string } warning warning and above
 * @property { string } error error and above
 * @property { string } fatal fatal only, indicates a crash is imminent
 */

/**
 * ProxyConfig interface
 * @typedef { Object } ProxyConfig
 * @property { numder } proxyPort The port number of the running application
 * @property { string } proxyAddress The address of the running application
 * @property { string } type
 */

/**
 * RegistryInfo interface
 * @typedef { Object } RegistryInfo
 * @property { any } data The registry data
 * @property { string } rootKey The registry root key
 * @property { string } subkey The registry key
 * @property { string } type The registry type
 * @property { string } value The registry value name
 */

/**
 * RuntimeDownloadOptions interface
 * @typedef { Object } RuntimeDownloadOptions
 * @desc These are the options object required by the downloadRuntime function.
 * @property { string } version The given version to download
 */

/**
 * TerminateExternalRequestType interface
 * @typedef { Object } TerminateExternalRequestType
 * @property { string } uuid The uuid of the running application
 * @property { number } timeout Time out period before the running application terminates
 * @property { boolean } killtree Value to terminate the running application
 */

/**
 * DownloadPreloadOption interface
 * @typedef { Object } DownloadPreloadOption
 * @desc These are the options object required by the downloadPreloadScripts function
 * @property { string } url url to the preload script
 */

/**
 * DownloadPreloadInfo interface
 * @typedef { Object } DownloadPreloadInfo
 * @desc downloadPreloadScripts function return value
 * @property { string } url url to the preload script
 * @property { string } error error during preload script acquisition
 * @property { boolean } succeess download operation success
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

        this.on('removeListener', (eventType: string) => {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic: this.topic
            }));
        });

        this.on('newListener', (eventType: string) => {
            this.registerEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic: this.topic
            }));
        });

    }

    /**
     * Returns the version of the runtime. The version contains the major, minor,
     * build and revision numbers.
     * @return {Promise.<string>}
     * @tutorial System.getVersion
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
     * @tutorial System.clearCache
     */
    public clearCache(): Promise<void> {
        return this.wire.sendAction('clear-cache').then(() => undefined);
    }

    /**
     * Clears all cached data when OpenFin Runtime exits.
     * @return {Promise.<void>}
     * @tutorial System.deleteCacheOnExit
     */
    public deleteCacheOnExit(): Promise<void> {
        return this.wire.sendAction('delete-cache-request').then(() => undefined);
    }

    /**
     * Exits the Runtime.
     * @return {Promise.<void>}
     * @tutorial System.exit
     */
    public exit(): Promise<void> {
        return this.wire.sendAction('exit-desktop').then(() => undefined);
    }

    /**
     * Writes any unwritten cookies data to disk.
     * @return {Promise.<void>}
     * @tutorial System.flushCookieStore
     */
    public flushCookieStore(): Promise<void> {
        return this.wire.sendAction('flush-cookie-store').then(() => undefined);
    }

    /**
     * Retrieves an array of data (name, ids, bounds) for all application windows.
     * @return {Promise.Array.<WindowInfo>}
     * @tutorial System.getAllWindows
     */
    public getAllWindows(): Promise<Array<WindowInfo>> {
        return this.wire.sendAction('get-all-windows')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array of data for all applications.
     * @return {Promise.Array.<ApplicationInfo>}
     * @tutorial System.getAllApplications
     */
    public getAllApplications(): Promise<Array<ApplicationInfo>> {
        return this.wire.sendAction('get-all-applications')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the command line argument string that started OpenFin Runtime.
     * @return {Promise.<string>}
     * @tutorial System.getCommandLineArguments
     */
    public getCommandLineArguments(): Promise<string> {
        return this.wire.sendAction('get-command-line-arguments')
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns a hex encoded hash of the mac address and the currently logged in user name
     * @return {Promise.<string>}
     * @tutorial System.getDeviceId
     */
    public getDeviceId(): Promise<string> {
        return this.wire.sendAction('get-device-id').then(({ payload }) => payload.data);
    }

    /**
     * Returns a hex encoded hash of the mac address and the currently logged in user name
     * @return {Promise.<string>}
     * @tutorial System.getDeviceUserId
     */
    public getDeviceUserId(): Promise<string> {
        return this.wire.sendAction('get-device-user-id').then(({ payload }) => payload.data);
    }

    /**
     * Retrieves a frame info object for the uuid and name passed in
     * @param { string } uuid - The UUID of the target.
     * @param { string } name - The name of the target.
     * @return {Promise.<EntityInfo>}
     * @tutorial System.getEntityInfo
     */
    public getEntityInfo(uuid: string, name: string): Promise<EntityInfo> {
        return this.wire.sendAction('get-entity-info', { uuid, name }).then(({ payload }) => payload.data);
    }

    /**
     * Gets the value of a given environment variable on the computer on which the runtime is installed
     * @return {Promise.<string>}
     * @tutorial System.getEnvironmentVariable
     */
    public getEnvironmentVariable(envName: string): Promise<string> {
        return this.wire.sendAction('get-environment-variable', {
            environmentVariables: envName
        })
            .then(({ payload }) => payload.data);
    }

    /**
     * Get current focused window.
     * @return {Promise.<WindowInfo>}
     * @tutorial System.getFocusedWindow
     */
    public getFocusedWindow(): Promise<WindowInfo> {
        return this.wire.sendAction('get-focused-window').then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the contents of the log with the specified filename.
     * @param { GetLogRequestType } options A object that id defined by the GetLogRequestType interface
     * @return {Promise.<string>}
     * @tutorial System.getLog
     */
    public getLog(options: GetLogRequestType): Promise<string> {
        return this.wire.sendAction('view-log', options)
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns the minimum (inclusive) logging level that is currently being written to the log.
     * @return {Promise.<LogLevel>}
     * @tutorial System.getMinLogLevel
     */
    public getMinLogLevel(): Promise<LogLevel> {
        return this.wire.sendAction('get-min-log-level').then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array containing information for each log file.
     * @return {Promise.Array<LogInfo>}
     * @tutorial System.getLogList
     */
    public getLogList(): Promise<Array<LogInfo>> {
        return this.wire.sendAction('list-logs')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an object that contains data about the monitor setup of the
     * computer that the runtime is running on.
     * @return {Promise.<MonitorInfo>}
     * @tutorial System.getMonitorInfo
     */
    public getMonitorInfo(): Promise<MonitorInfo> {
        return this.wire.sendAction('get-monitor-info')
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns the mouse in virtual screen coordinates (left, top).
     * @return {Promise.<PointTopLeft>}
     * @tutorial System.getMousePosition
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
     * @tutorial System.getProcessList
     */
    public getProcessList(): Promise<Array<ProcessInfo>> {
        return this.wire.sendAction('process-snapshot')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves the Proxy settings.
     * @return {Promise.<ProxyInfo>}
     * @tutorial System.getProxySettings
     */
    public getProxySettings(): Promise<ProxyInfo> {
        return this.wire.sendAction('get-proxy-settings')
            .then(({ payload }) => payload.data);
    }

    /**
     * Returns information about the running Runtime in an object.
     * @return {Promise.<RuntimeInfo>}
     * @tutorial System.getRuntimeInfo
     */
    public getRuntimeInfo(): Promise<RuntimeInfo> {
        return this.wire.sendAction('get-runtime-info').then(({ payload }) => payload.data);
    }

    /**
     * Returns information about the running RVM in an object.
     * @return {Promise.<RVMInfo>}
     * @tutorial System.getRvmInfo
     */
    // incompatible with standalone node process.
    public getRvmInfo(): Promise<RVMInfo> {
        return this.wire.sendAction('get-rvm-info')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves system information.
     * @return {Promise.<Hostspecs>}
     * @tutorial System.getHostSpecs
     */
    public getHostSpecs(): Promise<HostSpecs> {
        return this.wire.sendAction('get-host-specs').then(({ payload }) => payload.data);
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
     * @return {Promise.<void>}
     * @tutorial System.openUrlWithBrowser
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
     * @param { AppAssetInfo } appAsset App asset object
     * @return {Promise.<void>}
     */
    // incompatible with standalone node process.
    public downloadAsset(appAsset: AppAssetInfo, progressListener: (progress: RuntimeDownloadProgress) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            //node.js environment not supported
            if (this.wire.environment.constructor.name === 'NodeEnvironment') {
                reject(new NotSupportedError('downloadAsset only supported in an OpenFin Render process'));
                return;
            }

            const downloadId = this.wire.environment.getNextMessageId().toString();
            const dlProgressKey = `asset-download-progress-${ downloadId }`;
            const dlErrorKey = `asset-download-error-${  downloadId }` ;
            const dlCompleteKey = `asset-download-complete-${ downloadId }`;

            const dlProgress = (progress: RuntimeDownloadProgress) => {
                const p: RuntimeDownloadProgress = {
                    downloadedBytes: progress.downloadedBytes,
                    totalBytes: progress.totalBytes
                };

                progressListener(p);
            };

            const cleanListeners = () => {
                this.removeListener(dlProgressKey, dlProgress);
            };

            const dlError = (r: string, err: Error) => {
                const error = err ? err : r;
                cleanListeners();
                reject(new RuntimeError(error));
            };

            const dlComplete = () => {
                cleanListeners();
                resolve();
            };

            this.on(dlProgressKey, dlProgress);
            this.once(dlErrorKey, dlError);
            this.once(dlCompleteKey, dlComplete);

            const downloadOptions: any = Object.assign(appAsset, { downloadId });

            this.wire.sendAction('download-asset', downloadOptions).catch((err: Error) => {
                cleanListeners();
                reject(err);
            });

        });
    }

    /**
    * Downloads a version of the runtime.
    * @param { RuntimeDownloadOptions } options - Download options.
    * @param {Function} [progressListener] - called as the runtime is downloaded with progress information.
    * @return {Promise.<void>}
    * @tutorial System.downloadRuntime
    */
    public downloadRuntime(options: RuntimeDownloadOptions, progressListener: (progress: RuntimeDownloadProgress) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            //node.js environment not supported
            if (this.wire.environment.constructor.name === 'NodeEnvironment') {
                reject(new NotSupportedError('downloadRuntime only supported in an OpenFin Render process'));
                return;
            }

            const downloadId = this.wire.environment.getNextMessageId().toString();
            const dlProgressKey = `runtime-download-progress-${ downloadId }`;
            const dlErrorKey = `runtime-download-error-${  downloadId }` ;
            const dlCompleteKey = `runtime-download-complete-${ downloadId }`;

            const dlProgress = (progress: RuntimeDownloadProgress) => {
                const p: RuntimeDownloadProgress = {
                    downloadedBytes: progress.downloadedBytes,
                    totalBytes: progress.totalBytes
                };

                progressListener(p);
            };

            const cleanListeners = () => {
                this.removeListener(dlProgressKey, dlProgress);
            };

            const dlError = (r: string, err: Error) => {
                const error = err ? err : r;
                cleanListeners();
                reject(new RuntimeError(error));
            };

            const dlComplete = () => {
                cleanListeners();
                resolve();
            };

            this.on(dlProgressKey, dlProgress);
            this.once(dlErrorKey, dlError);
            this.once(dlCompleteKey, dlComplete);

            const downloadOptions: any = Object.assign(options, { downloadId });

            this.wire.sendAction('download-runtime', downloadOptions).catch((err: Error) => {
                cleanListeners();
                reject(err);
            });
        });
    }

    /**
    * Download preload scripts from given URLs
    * @param {DownloadPreloadOption[]} scripts - URLs of preload scripts. See tutorial for more details.
    * @return {Promise.Array<DownloadPreloadInfo>}
     * @tutorial system.downloadPreloadScripts
    */
    public downloadPreloadScripts(scripts: Array<DownloadPreloadOption>): Promise<Array<DownloadPreloadInfo>> {
        return this.wire.sendAction('download-preload-scripts', { scripts }).then(({ payload }) => payload.data);
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
     * Retrieves app asset information.
     * @param { AppAssetRequest } options
     * @return {Promise.<AppAssetInfo>}
     * @tutorial System.getAppAssetInfo
     */
    public getAppAssetInfo(options: AppAssetRequest): Promise<AppAssetInfo> {
        return this.wire.sendAction('get-app-asset-info', options).then(({ payload }) => payload.data);
    }

    /**
     * Get additional info of cookies.
     * @param { CookieOption } options - See tutorial for more details.
     * @return {Promise.Array.<CookieInfo>}
     * @tutorial System.getCookies
     */
    public getCookies(options: CookieOption): Promise<Array<CookieInfo>> {
        return this.wire.sendAction('get-cookies', options).then(({ payload }) => payload.data);
    }

    /**
     * Set the minimum log level above which logs will be written to the OpenFin log
     * @param { LogLevel } The minimum level (inclusive) above which all calls to log will be written
     * @return {Promise.<void>}
     * @tutorial System.setMinLogLevel
     */
    public setMinLogLevel(level: LogLevel): Promise<void> {
        return this.wire.sendAction('set-min-log-level', {level}).then(() => undefined);
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

    /**
     * Reads the specifed value from the registry.
     * @param { string } rootKey - The registry root key.
     * @param { string } subkey - The registry key.
     * @param { string } value - The registry value name.
     * @return {Promise.<RegistryInfo>}
     * @tutorial System.readRegistryValue
     */
    public readRegistryValue(rootKey: string, subkey: string, value: string): Promise<RegistryInfo> {
        return this.wire.sendAction('read-registry-value', {
            rootKey: rootKey,
            subkey: subkey,
            value: value
        }).then(({ payload }) => payload.data);
    }

    /**
     * This function call will register a unique id and produce a token.
     * The token can be used to broker an external connection.
     * @param { string } uuid - A UUID for the remote connection.
     * @return {Promise.<ExternalConnection>}
     * @tutorial System.registerExternalConnection
     */
    public registerExternalConnection(uuid: string): Promise<ExternalConnection> {
        return this.wire.sendAction('register-external-connection', {uuid}).then(({ payload }) => payload.data);
    }
}
