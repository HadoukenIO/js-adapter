import { EmitterBase } from '../base';
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
import { InstalledRuntimes} from './installed-runtimes';
import { RuntimeInfo } from './runtime-info';
import { Entity, EntityInfo } from './entity';
import { HostSpecs } from './host-specs';
import { ExternalProcessRequestType , TerminateExternalRequestType, ExternalConnection, ExitCode,
    ExternalProcessInfo, ServiceConfiguration } from './external-process';
import Transport from '../../transport/transport';
import { CookieInfo, CookieOption } from './cookie';
import { RegistryInfo } from './registry-info';
import { DownloadPreloadOption, DownloadPreloadInfo } from './download-preload';
import { RuntimeError, NotSupportedError } from '../../transport/transport-errors';
import { ClearCacheOption } from './clearCacheOption';
import { CrashReporterOption } from './crashReporterOption';
import { SystemEvents } from '../events/system';
import { _Window } from '../window/window';

/**
 * AppAssetInfo interface
 * @typedef { object } AppAssetInfo
 * @property { string } src  The URL to a zip file containing the package files (executables, dlls, etc…)
 * @property { string } alias The name of the asset
 * @property { string } version The version of the package
 * @property { string } target Specify default executable to launch. This option can be overridden in launchExternalProcess
 * @property { string } args The default command line arguments for the aforementioned target.
 * @property { boolean } mandatory When set to true, the app will fail to load if the asset cannot be downloaded.
 * When set to false, the app will continue to load if the asset cannot be downloaded. (Default: true)
 */

/**
 * AppAssetRequest interface
 * @typedef { object } AppAssetRequest
 * @property { string } alias The name of the asset
 */

/**
 * ApplicationInfo interface
 * @typedef { object } ApplicationInfo
 * @property { boolean } isRunning  true when the application is running
 * @property { string } uuid uuid of the application
 * @property { string } parentUuid uuid of the application that launches this application
 */

/**
 * @typedef { object } ClearCacheOption
 * @summary Clear cache options.
 * @desc These are the options required by the clearCache function.
 *
 * @property {boolean} appcache html5 application cache
 * @property {boolean} cache browser data cache for html files and images
 * @property {boolean} cookies browser cookies
 * @property {boolean} localStorage browser data that can be used across sessions
 */

/**
 * CookieInfo interface
 * @typedef { object } CookieInfo
 * @property { string } name  The name of the cookie
 * @property { string } domain The domain of the cookie
 * @property { string } path The path of the cookie
 */

/**
 * CookieOption interface
 * @typedef { object } CookieOption
 * @property { string } name The name of the cookie
 */

/**
 * CpuInfo interface
 * @typedef { object } CpuInfo
 * @property { string } model The model of the cpu
 * @property { number } speed The number in MHz
 * @property { Time } times The numbers of milliseconds the CPU has spent in different modes.
 */

 /**
 * CrashReporterOption interface
 * @typedef { object } CrashReporterOption
 * @property { boolean } diagnosticMode In diagnostic mode the crash reporter will send diagnostic logs to
 *  the OpenFin reporting service on runtime shutdown
 * @property { boolean } isRunning check if it's running
 */

/**
 * DipRect interface
 * @typedef { object } DipRect
 * @property { Rect } dipRect The DIP coordinates
 * @property { Rect } scaledRect The scale coordinates
 */

/**
 * DipScaleRects interface
 * @typedef { object } DipScaleRects
 * @property { Rect } dipRect The DIP coordinates
 * @property { Rect } scaledRect The scale coordinates
 */

/**
 * DownloadPreloadInfo interface
 * @typedef { object } DownloadPreloadInfo
 * @desc downloadPreloadScripts function return value
 * @property { string } url url to the preload script
 * @property { string } error error during preload script acquisition
 * @property { boolean } succeess download operation success
 */

/**
 * DownloadPreloadOption interface
 * @typedef { object } DownloadPreloadOption
 * @desc These are the options object required by the downloadPreloadScripts function
 * @property { string } url url to the preload script
 */

/**
 * Entity interface
 * @typedef { object } Entity
 * @property { string } type The type of the entity
 * @property { string } uuid The uuid of the entity
 */

/**
 * EntityInfo interface
 * @typedef { object } EntityInfo
 * @property { string } name The name of the entity
 * @property { string } uuid The uuid of the entity
 * @property { Identity } parent The parent of the entity
 * @property { string } entityType The type of the entity
 */

/**
 * ExternalApplicationInfo interface
 * @typedef { object } ExternalApplicationInfo
 * @property { Identity } parent The parent identity
 */

/**
 * ExternalConnection interface
 * @typedef { object } ExternalConnection
 * @property { string } token The token to broker an external connection
 * @property { string } uuid The uuid of the external connection
 */

/**
 * ExternalProcessRequestType interface
 * @typedef { object } ExternalProcessRequestType
 * @property { string } path The file path to where the running application resides
 * @property { string } arguments The argument passed to the running application
 * @property { LaunchExternalProcessListener } listener This is described in the {LaunchExternalProcessListner} type definition
 */

/**
 * FrameInfo interface
 * @typedef { object } FrameInfo
 * @property { string } name The name of the frame
 * @property { string } uuid The uuid of the frame
 * @property { entityType } entityType The entity type, could be 'window', 'iframe', 'external connection' or 'unknown'
 * @property { Identity } parent The parent identity
 */

/**
 * GetLogRequestType interface
 * @typedef { object } GetLogRequestType
 * @property { string } name The name of the running application
 * @property { number } endFile The file length of the log file
 * @property { number } sizeLimit The set size limit of the log file
 */

/**
 * GpuInfo interface
 * @typedef { object } GpuInfo
 * @property { string } name The graphics card name
 */

/**
 * HostSpecs interface
 * @typedef { object } HostSpecs
 * @property { boolean } aeroGlassEnabled Value to check if Aero Glass theme is supported on Windows platforms
 * @property { string } arch "x86" for 32-bit or "x86_64" for 64-bit
 * @property { Array<CpuInfo> } cpus The same payload as Node's os.cpus()
 * @property { GpuInfo } gpu The graphics card name
 * @property { number } memory The same payload as Node's os.totalmem()
 * @property { string } name The OS name and version/edition
 * @property { boolean } screenSaver Value to check if screensaver is running. Supported on Windows only
 */

/**
 * Identity interface
 * @typedef { object } Identity
 * @property { string } name The name of the application
 * @property { string } uuid The uuid of the application
 */

 /**
 * InstalledRuntimes interface
 * @typedef { object } InstalledRuntimes
 * @property { string } action The name of action: "get-installed-runtimes"
 * @property { Array<string> } runtimes The version numbers of each installed runtime
 */

/**
 * LogInfo interface
 * @typedef { object } LogInfo
 * @property { string } name The filename of the log
 * @property { number } size The size of the log in bytes
 * @property { string } date The unix time at which the log was created "Thu Jan 08 2015 14:40:30 GMT-0500 (Eastern Standard Time)""
 */

/**
 * MonitorDetails interface
 * @typedef { object } MonitorDetails
 * @property { DipScaleRects } available The available DIP scale coordinates
 * @property { Rect } availableRect The available monitor coordinates
 * @property { string } deviceId The device id of the display
 * @property { boolean } displayDeviceActive true if the display is active
 * @property { number } deviceScaleFactor The device scale factor
 * @property { Rect } monitorRect The monitor coordinates
 * @property { string } name The name of the display
 * @property { Point } dpi The dots per inch
 * @property { DipScaleRects } monitor The monitor coordinates
 */

/**
 * MonitorInfo interface
 * @typedef { object } MonitorInfo
 * @property { number } deviceScaleFactor The device scale factor
 * @property { Point } dpi The dots per inch
 * @property { Array<MonitorDetails> } nonPrimaryMonitors The array of monitor details
 * @property { MonitorDetails } primaryMonitor The monitor details
 * @property { string } reason always "api-query"
 * @property { TaskBar } taskBar The taskbar on monitor
 * @property { DipRect } virtualScreen The virtual display screen coordinates
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
 * PointTopLeft interface
 * @typedef { object } PointTopLeft
 * @property { number } top The mouse top position in virtual screen coordinates
 * @property { number } left The mouse left position in virtual screen coordinates
 */

/**
 * Point interface
 * @typedef { object } Point
 * @property { number } x The mouse x position
 * @property { number } y The mouse y position
 */

/**
 * ProcessInfo interface
 * @typedef { object } ProcessInfo
 * @property { numder } cpuUsage The percentage of total CPU usage
 * @property { string } name The application name
 * @property { number } nonPagedPoolUsage The current nonpaged pool usage in bytes
 * @property { number } pageFaultCount The number of page faults
 * @property { number } pagedPoolUsage The current paged pool usage in bytes
 * @property { number } pagefileUsage The total amount of memory in bytes that the memory manager has committed
 * @property { number } peakNonPagedPoolUsage The peak nonpaged pool usage in bytes
 * @property { number } peakPagedPoolUsage The peak paged pool usage in bytes
 * @property { number } peakPagefileUsage The peak value in bytes of pagefileUsage during the lifetime of this process
 * @property { number } peakWorkingSetSize The peak working set size in bytes
 * @property { number } processId The native process identifier
 * @property { string } uuid The application UUID
 * @property { nubmer } workingSetSize The current working set size (both shared and private data) in bytes
 */

/**
 * ProxyConfig interface
 * @typedef { object } ProxyConfig
 * @property { string } proxyAddress The configured proxy address
 * @property { numder } proxyPort The configured proxy port
 * @property { string } type The proxy Type
 */

/**
 * ProxyInfo interface
 * @typedef { object } ProxyInfo
 * @property { ProxyConfig } config The proxy config
 * @property { ProxySystemInfo } system The proxy system info
 */

/**
 * ProxySystemInfo interface
 * @typedef { object } ProxySystemInfo
 * @property { string } autoConfigUrl The auto configuration url
 * @property { string } bypass The proxy bypass info
 * @property { boolean } enabled Value to check if a proxy is enabled
 * @property { string } proxy The proxy info
 */

/**
 * Rect interface
 * @typedef { object } Rect
 * @property { number } bottom The bottom-most coordinate
 * @property { nubmer } left The left-most coordinate
 * @property { number } right The right-most coordinate
 * @property { nubmer } top The top-most coordinate
 */

/**
 * RegistryInfo interface
 * @typedef { object } RegistryInfo
 * @property { any } data The registry data
 * @property { string } rootKey The registry root key
 * @property { string } subkey The registry key
 * @property { string } type The registry type
 * @property { string } value The registry value name
 */

/**
 * RuntimeDownloadOptions interface
 * @typedef { object } RuntimeDownloadOptions
 * @desc These are the options object required by the downloadRuntime function.
 * @property { string } version The given version to download
 */

/**
 * RuntimeInfo interface
 * @typedef { object } RuntimeInfo
 * @property { string } architecture The runtime build architecture
 * @property { string } manifestUrl The runtime manifest URL
 * @property { nubmer } port The runtime websocket port
 * @property { string } securityRealm The runtime security realm
 * @property { string } version The runtime version
 * @property { object } args the command line argument used to start the Runtime
 */

/**
 * RVMInfo interface
 * @typedef { object } RVMInfo
 * @property { string } action The name of action: "get-rvm-info"
 * @property { string } appLogDirectory The app log directory
 * @property { string } path The path of OpenfinRVM.exe
 * @property { string } 'start-time' The start time of RVM
 * @property { string } version The version of RVM
 * @property { string } 'working-dir' The working directory
 */

/**
 * ShortCutConfig interface
 * @typedef { object } ShortCutConfig
 * @property { boolean } desktop true if application has a shortcut on the desktop
 * @property { boolean } startMenu true if application has shortcut in the start menu
 * @property { boolean } systemStartup true if application will be launched on system startup
 */

/**
 * SubOptions interface
 * @typedef { Object } SubOptions
 * @property { number } timestamp The event timestamp
 */

/**
 * TaskBar interface
 * @typedef { object } TaskBar
 * @property { string } edge which edge of a monitor the taskbar is on
 * @property { Rect } rect The taskbar coordinates
 */

/**
 * TerminateExternalRequestType interface
 * @typedef { object } TerminateExternalRequestType
 * @property { string } uuid The uuid of the running application
 * @property { number } timeout Time out period before the running application terminates
 * @property { boolean } killtree Value to terminate the running application
 */

/**
 * Time interface
 * @typedef { object } Time
 * @property { number } user The number of milliseconds the CPU has spent in user mode
 * @property { number } nice The number of milliseconds the CPU has spent in nice mode
 * @property { number } sys The number of milliseconds the CPU has spent in sys mode
 * @property { number } idle The number of milliseconds the CPU has spent in idle mode
 * @property { number } irq The number of milliseconds the CPU has spent in irq mode
 */

/**
 * TrayInfo interface
 * @typedef { object } TrayInfo
 * @property { Bounds } bounds The bound of tray icon in virtual screen pixels
 * @property { MonitorInfo } monitorInfo Please see fin.System.getMonitorInfo for more information
 * @property { number } x copy of bounds.x
 * @property { number } y copy of bounds.y
 */

/**
 * WindowDetail interface
 * @typedef { object } WindowDetail
 * @property { number } bottom The bottom-most coordinate of the window
 * @property { number } height The height of the window
 * @property { boolean } isShowing Value to check if the window is showing
 * @property { number } left The left-most coordinate of the window
 * @property { string } name The name of the window
 * @property { number } right The right-most coordinate of the window
 * @property { string } state The window state
 * @property { number } top The top-most coordinate of the window
 * @property { number } width The width of the window
 */

/**
 * WindowInfo interface
 * @typedef { object } WindowInfo
 * @property { Array<WindowDetail> } childWindows The array of child windows details
 * @property { WindowDetail } mainWindow The main window detail
 * @property { string } uuid The uuid of the application
 */

 /**
 * Service identifier
 * @typedef { object } ServiceIdentifier
 * @property { string } name The name of the service
 */

 interface ServiceIdentifier {
     name: string;
 }

/**
 * An object representing the core of OpenFin Runtime. Allows the developer
 * to perform system-level actions, such as accessing logs, viewing processes,
 * clearing the cache and exiting the runtime as well as listen to <a href="tutorial-System.EventEmitter.html">system events</a>.
 * @namespace
 */
export default class System extends EmitterBase<SystemEvents> {

    constructor(wire: Transport) {
        super(wire, ['system']);
    }

    private sendExternalProcessRequest(action: string, options: ExternalProcessRequestType | ExternalProcessInfo): Promise<Identity> {
        return new Promise((resolve, reject) => {
            const exitEventKey: string = 'external-process-exited';
            let processUuid: string;
            let externalProcessExitHandler: (payload: any) => void;
            let ofWindow: _Window;
            if (typeof options.listener === 'function') {
                externalProcessExitHandler = (payload: any) => {
                    const data: any = payload || {};
                    const exitPayload: ExitCode = {
                        topic: 'exited',
                        uuid: data.processUuid || '',
                        exitCode: data.exitCode || 0
                    };
                    if (processUuid === payload.processUuid) {
                        options.listener(exitPayload);
                        ofWindow.removeListener(exitEventKey, externalProcessExitHandler);
                    }
                };
                // window constructor expects the name is not undefined
                if (!this.wire.me.name) {
                   this.wire.me.name = this.wire.me.uuid;
                }
                ofWindow = new _Window(this.wire, this.wire.me);
                ofWindow.on(exitEventKey, externalProcessExitHandler);
            }
            this.wire.sendAction(action, options)
            .then(({ payload }) => {
                processUuid = payload.data.uuid;
                resolve(payload.data);
            }).catch((err: Error) => {
                if (ofWindow) {
                    ofWindow.removeListener(exitEventKey, externalProcessExitHandler);
                }
                reject(err);
            });
        });
    }

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - Called whenever an event of the specified type occurs.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function addListener
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

    /**
     * Adds a listener to the end of the listeners array for the specified event.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - Called whenever an event of the specified type occurs.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function on
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

    /**
     * Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function once
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

    /**
     * Adds a listener to the beginning of the listeners array for the specified event.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function prependListener
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

    /**
     * Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
     * The listener is added to the beginning of the listeners array.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function prependOnceListener
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

    /**
     * Remove a listener from the listener array for the specified event.
     * Caution: Calling this method changes the array indices in the listener array behind the listener.
     * @param { string | symbol } eventType  - The type of the event.
     * @param { Function } listener - The callback function.
     * @param { SubOptions } [options] - Option to support event timestamps.
     * @return {Promise.<this>}
     * @function removeListener
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

    /**
     * Removes all listeners, or those of the specified event.
     * @param { string | symbol } [eventType]  - The type of the event.
     * @return {Promise.<this>}
     * @function removeAllListeners
     * @memberof System
     * @instance
     * @tutorial System.EventEmitter
     */

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
     * Clears cached data containing application resource
     * files (images, HTML, JavaScript files), cookies, and items stored in the
     * Local Storage.
     * @param { ClearCacheOption } options - See tutorial for more details.
     * @return {Promise.<void>}
     * @tutorial System.clearCache
     */
    public clearCache(options: ClearCacheOption): Promise<void> {
        return this.wire.sendAction('clear-cache', options).then(() => undefined);
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
     * Get the current state of the crash reporter.
     * @return {Promise.<CrashReporterOption>}
     * @tutorial System.getCrashReporterState
     */
    public getCrashReporterState(): Promise<CrashReporterOption> {
        return this.wire.sendAction('get-crash-reporter-state').then(({ payload }) => payload.data);
    }

    /* <-- Note the one asterisk to hide from jsdoc because we don't want to publish this method anymore.
     * @deprecated Use {@link System.getMachineId} instead.
     */
    public getDeviceId(): Promise<string> {
        console.warn('Function is deprecated; use getMachineId instead.');
        return this.wire.sendAction('get-device-id').then(({ payload }) => payload.data);
    }

    /**
     * Start the crash reporter for the browser process if not already running.
     * You can optionally specify `diagnosticMode` to have the logs sent to
     * OpenFin on runtime close
     *
     * @param { CrashReporterOption } options - configure crash reporter
     * @return {Promise.<CrashReporterOption>}
     * @tutorial System.startCrashReporter
     */
    public startCrashReporter(options: CrashReporterOption): Promise<CrashReporterOption> {
        return new Promise((resolve, reject) => {
            if (!options.diagnosticMode) {
                return reject(new Error('diagnosticMode not found in options'));
            }
            this.wire.sendAction('start-crash-reporter', options).then(({ payload }) => resolve(payload.data)).catch(err => reject(err));
        });
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
     * Get currently focused external window.
     * @return {Promise.<Identity>}
     * @experimental
     */
    public async getFocusedExternalWindow(): Promise<Identity> {
        const { payload: { data } } = await this.wire.sendAction('get-focused-external-window');
        return data;
    }

    /**
     * Returns an array of all the installed runtime versions in an object.
     * @return {Promise.<InstalledRuntimes>}
     * @tutorial System.getInstalledRuntimes
     */
    // incompatible with standalone node process.
    public getInstalledRuntimes() : Promise<InstalledRuntimes> {
        return this.wire.sendAction('get-installed-runtimes')
            .then(({ payload }) => payload.data.runtimes);
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
     * Returns a unique identifier (UUID) provided by the machine.
     * @return {Promise.<string>}
     * @tutorial System.getMachineId
     */
    public getMachineId(): Promise<string> {
        return this.wire.sendAction('get-machine-id').then(({ payload }) => payload.data);
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
     * @return {Promise.<HostSpecs>}
     * @tutorial System.getHostSpecs
     */
    public getHostSpecs(): Promise<HostSpecs> {
        return this.wire.sendAction('get-host-specs').then(({ payload }) => payload.data);
    }

    /**
     * Runs an executable or batch file.
     * @param { ExternalProcessRequestType } options A object that is defined in the ExternalProcessRequestType interface
     * @return {Promise.<Identity>}
     * @tutorial System.launchExternalProcess
     */
    public launchExternalProcess(options: ExternalProcessRequestType): Promise<Identity> {
        return this.sendExternalProcessRequest('launch-external-process', options);
    }

    /**
     * Monitors a running process.
     * @param { ExternalProcessInfo } options See tutorial for more details
     * @return {Promise.<Identity>}
     * @tutorial System.monitorExternalProcess
     */
    public monitorExternalProcess(options: ExternalProcessInfo): Promise<Identity> {
        return this.sendExternalProcessRequest('monitor-external-process', options);
    }

    /**
     * Writes the passed message into both the log file and the console.
     * @param { string } level The log level for the entry. Can be either "info", "warning" or "error"
     * @param { string } message The log message text
     * @return {Promise.<void>}
     * @tutorial System.log
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
     * of fin.System.launchExternalProcess().
     * @param { string } uuid The UUID for a process obtained from a prior call to fin.desktop.System.launchExternalProcess()
     * @return {Promise.<void>}
     * @tutorial System.releaseExternalProcess
     */
    public releaseExternalProcess(uuid: string): Promise<void> {
        return this.wire.sendAction('release-external-process', { uuid }).then(() => undefined);
    }

    /**
     * Shows the Chromium Developer Tools for the specified window
     * @param { Identity } identity This is a object that is defined by the Identity interface
     * @return {Promise.<void>}
     * @tutorial System.showDeveloperTools
     */
    public showDeveloperTools(identity: Identity): Promise<void> {
        return this.wire.sendAction('show-developer-tools', identity).then(() => undefined);
    }

    /**
     * Attempt to close an external process. The process will be terminated if it
     * has not closed after the elapsed timeout in milliseconds.
     * @param { TerminateExternalRequestType } options A object defined in the TerminateExternalRequestType interface
     * @return {Promise.<void>}
     * @tutorial System.terminateExternalProcess
     */
    public terminateExternalProcess(options: TerminateExternalRequestType): Promise<void> {
        return this.wire.sendAction('terminate-external-process', options)
            .then(() => undefined);
    }

    /**
     * Update the OpenFin Runtime Proxy settings.
     * @param { ProxyConfig } options A config object defined in the ProxyConfig interface
     * @return {Promise.<void>}
     * @tutorial System.updateProxySettings
     */
    public updateProxySettings(options: ProxyConfig): Promise<void> {
        return this.wire.sendAction('update-proxy', options).then(() => undefined);
    }

    /**
     * Downloads the given application asset
     * @param { AppAssetInfo } appAsset App asset object
     * @return {Promise.<void>}
     * @tutorial System.downloadAsset
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
    * @tutorial System.downloadPreloadScripts
    */
    public downloadPreloadScripts(scripts: Array<DownloadPreloadOption>): Promise<Array<DownloadPreloadInfo>> {
        return this.wire.sendAction('download-preload-scripts', { scripts }).then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array of data (name, ids, bounds) for all application windows.
     * @return {Promise.Array.<Identity>}
     * @tutorial System.getAllExternalApplications
     */
    public getAllExternalApplications(): Promise<Array<Identity>> {
        return this.wire.sendAction('get-all-external-applications')
            .then(({ payload }) => payload.data);
    }

    /**
     * Retrieves an array of objects representing information about currently
     * running user-friendly native windows on the system.
     * @return {Promise.Array.<Identity>}
     * @experimental
     */
    public getAllExternalWindows(): Promise<Array<Identity>> {
        return this.wire.sendAction('get-all-external-windows')
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
     * @tutorial System.resolveUuid
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
     * @ignore
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

    /**
     * Returns the json blob found in the [desktop owner settings](https://openfin.co/documentation/desktop-owner-settings/)
     * for the specified service.
     * More information about desktop services can be found [here](https://developers.openfin.co/docs/desktop-services).
     * @param { ServiceIdentifier } serviceIdentifier An object containing a name key that identifies the service.
     * @return {Promise.<ServiceConfiguration>}
     * @tutorial System.getServiceConfiguration
     */
    public async getServiceConfiguration(serviceIdentifier: ServiceIdentifier): Promise<ServiceConfiguration> {
        if (typeof serviceIdentifier.name !== 'string') {
            throw new Error('Must provide an object with a `name` property having a string value');
        }
        const { name } = serviceIdentifier;
        return this.wire.sendAction('get-service-configuration', {name}).then(({ payload }) => payload.data);
    }
}
