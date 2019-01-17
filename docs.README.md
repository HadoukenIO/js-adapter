<style>
article > ul:last-of-type {
    position: relative;
    width: 50em;
    list-style-type: none;
    padding: 0;
    column-count: 2;
    -moz-column-count: 2
}
.dashbox {
    position: relative;
    width: 30em;
    padding: .65em;
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2.5em;
    border: 1px dashed grey;
    background-color: ivory;
}
</style>

Welcome to the <big>JavaScript API</big>. This API allows you to create an HTML/JavaScript application that has access to the native windowing
environment, can communicate with other applications and has access to sandboxed system-level features.

#### The `fin` namespace
When running within the OpenFin Runtime your web applications have access to the `fin` namespace and all the modules within the API without the need to include additional source files.
You can treat the `fin` namespace as you would the `window`, `navigator` or `document` objects.

#### API Methods
The full <big>[API Method Index](#index)</big> can be found below.
* To find a specific method by name, simply search this page.
* To browse the API, click one of the classes or namespaces in the sidebar at left.

<div class=dashbox>
For a single-page reference to all application settings and configuration options, see also our <big>{@link https://openfin.co/application-config Application Config}</big> page.
</div>

#### Example
```html
<!DOCTYPE html>
    <head>
        <style>
            #status-indicator {
              display: inline-block;
              height: 10px;
              width: 10px;
              background-color: red;
              border-radius: 20px;
            }
            #status-indicator.online {
              background-color: green;
            }
        </style>
        <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', () => {
            //get the current version.
            fin.System.getVersion().then(version => {
                document.querySelector('#of-version').innerText = version;
            });
        });
        </script>
    </head>
    <body>
        <p>
            OpenFin adapter <span id="of-version"></span>
        </p>
    </body>
</html>
```

#### Index of API Methods <span id=index></span>
* {@link Window#animate animate} _Window_
* {@link Window#authenticate authenticate} _Window_
* {@link Window#blur blur} _Window_
* {@link Window#bringToFront bringToFront} _Window_
* {@link System#clearCache clearCache} _System_
* {@link Application#close close} _Application_
* {@link Notification#close close} _Notification_
* {@link Window#close close} _Window_
* {@link InterApplicationBus.Channel.connect connect} _Channel_
* {@link Application.create create} _Application_
* {@link InterApplicationBus.Channel.create create} _Channel_
* {@link Window.create create} _Window_
* {@link Application.createFromManifest createFromManifest} _Application_
* {@link System#deleteCacheOnExit deleteCacheOnExit} _System_
* {@link Window#disableUserMovement disableUserMovement} _Window_
* {@link Channel#ChannelClient#dispatch dispatch} _ChannelClient_
* {@link Channel#ChannelProvider#dispatch dispatch} _ChannelProvider_
* {@link System#downloadAsset downloadAsset} _System_
* {@link System#downloadPreloadScripts downloadPreloadScripts} _System_
* {@link System#downloadRuntime downloadRuntime} _System_
* {@link Window#enableUserMovement enableUserMovement} _Window_
* {@link Window#executeJavaScript executeJavaScript} _Window_
* {@link System#exit exit} _System_
* {@link Window#flash flash} _Window_
* {@link System#flushCookieStore flushCookieStore} _System_
* {@link Window#focus focus} _Window_
* {@link System#getAllApplications getAllApplications} _System_
* {@link System#getAllExternalApplications getAllExternalApplications} _System_
* {@link System#getAllWindows getAllWindows} _System_
* {@link System#getAppAssetInfo getAppAssetInfo} _System_
* {@link Clipboard#getAvailableFormats getAvailableFormats} _Clipboard_
* {@link Window#getBounds getBounds} _Window_
* {@link Application#getChildWindows getChildWindows} _Application_
* {@link System#getCommandLineArguments getCommandLineArguments} _System_
* {@link System#getCookies getCookies} _System_
* {@link System#getCrashReporterState getCrashReporterState} _System_
* {@link Application.getCurrent getCurrent} _Application_
* {@link Frame.getCurrent getCurrent} _Frame_
* {@link Notification.getCurrent getCurrent} _Notification_
* {@link Window.getCurrent getCurrent} _Window_
* {@link Application.getCurrentSync getCurrentSync} _Application_
* {@link Frame.getCurrentSync getCurrentSync} _Frame_
* {@link Notification.getCurrentSync getCurrentSync} _Notification_
* {@link Window.getCurrentSync getCurrentSync} _Window_
* {@link System#getDeviceUserId getDeviceUserId} _System_
* {@link System#getEntityInfo getEntityInfo} _System_
* {@link System#getEnvironmentVariable getEnvironmentVariable} _System_
* {@link System#getFocusedWindow getFocusedWindow} _System_
* {@link Window#getGroup getGroup} _Window_
* {@link Application#getGroups getGroups} _Application_
* {@link System#getHostSpecs getHostSpecs} _System_
* {@link Application#getInfo getInfo} _Application_
* {@link ExternalApplication#getInfo getInfo} _ExternalApplication_
* {@link Frame#getInfo getInfo} _Frame_
* {@link Window#getInfo getInfo} _Window_
* {@link System#getLog getLog} _System_
* {@link System#getLogList getLogList} _System_
* {@link System#getMachineId getMachineId} _System_
* {@link System#getMinLogLevel getMinLogLevel} _System_
* {@link Application#getManifest getManifest} _Application_
* {@link System#getMonitorInfo getMonitorInfo} _System_
* {@link System#getMousePosition getMousePosition} _System_
* {@link Window#getOptions getOptions} _Window_
* {@link Window#getParentApplication getParentApplication} _Window_
* {@link Application#getParentUuid getParentUuid} _Application_
* {@link Frame#getParentWindow getParentWindow} _Frame_
* {@link Window#getParentWindow getParentWindow} _Window_
* {@link System#getProcessList getProcessList} _System_
* {@link System#getProxySettings getProxySettings} _System_
* {@link System#getRuntimeInfo getRuntimeInfo} _System_
* {@link System#getRvmInfo getRvmInfo} _System_
* {@link Application#getShortcuts getShortcuts} _Application_
* {@link Window#getSnapshot getSnapshot} _Window_
* {@link Window#getState getState} _Window_
* {@link Application#getTrayIconInfo getTrayIconInfo} _Application_
* {@link System#getVersion getVersion} _System_
* {@link Application#getWindow getWindow} _Application_
* {@link Application#getZoomLevel getZoomLevel} _Application_
* {@link Window#getZoomLevel getZoomLevel} _Window_
* {@link Window#hide hide} _Window_
* {@link GlobalHotkey#isRegistered isRegistered} _GlobalHotkey_
* {@link Application#isRunning isRunning} _Application_
* {@link Window#isShowing isShowing} _Window_
* {@link Window#joinGroup joinGroup} _Window_
* {@link System#launchExternalProcess launchExternalProcess} _System_
* {@link Window#leaveGroup leaveGroup} _Window_
* {@link System#log log} _System_
* {@link Window#maximize maximize} _Window_
* {@link Window#mergeGroups mergeGroups} _Window_
* {@link Window#minimize minimize} _Window_
* {@link System#monitorExternalProcess monitorExternalProcess} _System_
* {@link Window#moveBy moveBy} _Window_
* {@link Window#moveTo moveTo} _Window_
* {@link Window#navigate navigate} _Window_
* {@link Window#navigateBack navigateBack} _Window_
* {@link Window#navigateForward navigateForward} _Window_
* {@link InterApplicationBus.Channel.onChannelConnect onChannelConnect} _Channel_
* {@link InterApplicationBus.Channel.onChannelDisconnect onChannelDisconnect} _Channel_
* {@link System#openUrlWithBrowser openUrlWithBrowser} _System_
* {@link Channel#ChannelProvider#publish publish} _ChannelProvider_
* {@link InterApplicationBus#publish publish} _InterApplicationBus_
* {@link Clipboard#readHtml readHtml} _Clipboard_
* {@link System#readRegistryValue readRegistryValue} _System_
* {@link Clipboard#readRtf readRtf} _Clipboard_
* {@link Clipboard#readText readText} _Clipboard_
* {@link Channel#ChannelClient#register register} _ChannelClient_
* {@link Channel#ChannelProvider#register register} _ChannelProvider_
* {@link GlobalHotkey#register register} _GlobalHotkey_
* {@link System#registerExternalConnection registerExternalConnection} _System_
* {@link Application#registerUser registerUser} _Application_
* {@link System#releaseExternalProcess releaseExternalProcess} _System_
* {@link Window#reload reload} _Window_
* {@link Channel#ChannelClient#remove remove} _ChannelClient_
* {@link Channel#ChannelProvider#remove remove} _ChannelProvider_
* {@link Application#removeTrayIcon removeTrayIcon} _Application_
* {@link Window#resizeBy resizeBy} _Window_
* {@link Window#resizeTo resizeTo} _Window_
* {@link Application#restart restart} _Application_
* {@link Window#restore restore} _Window_
* {@link Application#run run} _Application_
* {@link Application#scheduleRestart scheduleRestart} _Application_
* {@link InterApplicationBus#send send} _InterApplicationBus_
* {@link Notification#sendMessage sendMessage} _Notification_
* {@link Application#setAppLogUsername setAppLogUsername} _Application_
* {@link Window#setAsForeground setAsForeground} _Window_
* {@link Window#setBounds setBounds} _Window_
* {@link System#setMinLogLevel setMinLogLevel} _System_
* {@link Application#setShortcuts setShortcuts} _Application_
* {@link Application#setTrayIcon setTrayIcon} _Application_
* {@link Application#setZoomLevel setZoomLevel} _Application_
* {@link Window#setZoomLevel setZoomLevel} _Window_
* {@link Window#show show} _Window_
* {@link Window#showAt showAt} _Window_
* {@link System#showDeveloperTools showDeveloperTools} _System_
* {@link System#startCrashReporter startCrashReporter} _System_
* {@link Window#stopFlashing stopFlashing} _Window_
* {@link Window#stopNavigation stopNavigation} _Window_
* {@link InterApplicationBus#subscribe subscribe} _InterApplicationBus_
* {@link Application#terminate terminate} _Application_
* {@link System#terminateExternalProcess terminateExternalProcess} _System_
* {@link GlobalHotkey#unregister unregister} _GlobalHotkey_
* {@link GlobalHotkey#unregisterAll unregisterAll} _GlobalHotkey_
* {@link InterApplicationBus#unsubscribe unsubscribe} _InterApplicationBus_
* {@link Window#updateOptions updateOptions} _Window_
* {@link System#updateProxySettings updateProxySettings} _System_
* {@link Application.wrap wrap} _Application_
* {@link ExternalApplication.wrap wrap} _ExternalApplication_
* {@link Frame.wrap wrap} _Frame_
* {@link Window.wrap wrap} _Window_
* {@link Application.wrapSync wrapSync} _Application_
* {@link ExternalApplication.wrapSync wrapSync} _ExternalApplication_
* {@link Frame.wrapSync wrapSync} _Frame_
* {@link Window.wrapSync wrapSync} _Window_
* {@link Clipboard#write write} _Clipboard_
* {@link Clipboard#writeHtml writeHtml} _Clipboard_
* {@link Clipboard#writeRtf writeRtf} _Clipboard_
* {@link Clipboard#writeText writeText} _Clipboard_

