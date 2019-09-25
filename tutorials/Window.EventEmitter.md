When an instance of `fin.Window` is created, it inherits an `EventEmitter` with the below methods so that it is possible to listen to OpenFin events. The below methods are asynchronous as they must cross process boundaries and setup the listener in the browser process.  When the `EventEmitter` receives an event from the browser process and emits on the renderer, all of the functions attached to that specific event are called synchronously.  Any values returned by the called listeners are ignored and will be discarded.  If the execution context of the window is destroyed by page navigation or reload, any events that have been setup in that context will be destroyed.
It is important to keep in mind that when an ordinary listener function is called, the standard `this` keyword is intentionally set to reference the `EventEmitter` instance to which the listener is attached.  It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the `EventEmitter` instance.

#### {@link Window#addListener addListener(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const finWindow = await fin.Window.getCurrent();

finWindow.addListener("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#on on(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const finWindow = await fin.Window.getCurrent();

finWindow.on("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#once once(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
```js
const finWindow = await fin.Window.getCurrent();

finWindow.once("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#prependListener prependListener(event, listener)}
Adds a listener to the beginning of the listeners array for the specified event.
```js
const finWindow = await fin.Window.getCurrent();

finWindow.prependListener("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#prependOnceListener prependOnceListener(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed. The listener is added to the beginning of the listeners array.
```js
const finWindow = await fin.Window.getCurrent();

finWindow.prependOnceListener("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#removeListener removeListener(event, listener)}
Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
```js
const finWindow = await fin.Window.getCurrent();
const callback = function(event) {
  console.log("The window has been moved or resized.");
};

finWindow.on("bounds-changed", callback);
finWindow.removeListener("bounds-changed", callback);
```

#### {@link Window#removeAllListeners removeAllListeners([event])}
Removes all listeners, or those of the specified event.
```js
const finWindow = await fin.Window.getCurrent();
finWindow.removeAllListeners("bounds-changed");
```

### Supported window event types

* auth-requested
* begin-user-bounds-changing
* blurred
* bounds-changed
* bounds-changing
* close-requested
* closed
* closing
* crashed
* disabled-movement-bounds-changed
* disabled-movement-bounds-changing
* embedded
* end-user-bounds-changing
* external-process-exited
* external-process-started
* file-download-completed
* file-download-progress
* file-download-started
* focused
* group-changed
* hidden
* initialized
* maximized
* minimized
* options-changed
* navigation-rejected
* performance-report
* preload-scripts-state-changed
* preload-scripts-state-changing
* reloaded
* resource-load-failed
* resource-response-received
* restored
* show-requested
* shown
* user-movement-disabled
* user-movement-enabled
* view-attached
* view-detached
* will-move
* will-resize

### Window Events

#### auth-requested
Generated when a window within this application requires credentials from the user.
```js
{
    name: "windowName",
    topic: "window",
    type: "auth-requested",
    uuid: "AppUUID" // the UUID of the application,
    authInfo: {
        host: "myserver",
        isProxy: false,
        port: 80,
        realm: "",
        scheme: "basic"
    }

}
```

#### begin-user-bounds-changing
Generated at the beginning of a user-driven change to a window's size or position.
```js
{

    height: 2,              //the height of the window prior to change.
    left: 2,                //the left-most coordinate of the window prior to change.
    name: "windowName",     //(string) the name of the window.
    reason: "self"          //the reason for the bounds change: 'animation' | 'group-animation' | 'self' | 'group'      
    top: 2,                 //the top-most coordinate of the window prior to change.
    topic: "window",
    type: "begin-user-bounds-changing",
    uuid: "appUUID",        //the UUID of the application the window belongs to.
    width: 2,               //the width of the window prior to change.
    windowState: "normal"   //the state of the window: "minimized", "normal", or "maximized"
}
```

#### blurred
Generated when a window loses focus.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "blurred",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### bounds-changed
Generated after changes in a window's size and/or position.
```js
//This response has the following shape:
{
    changeType: 2,  //describes what kind of change occurred.
                    //0 means a change in position.
                    //1 means a change in size.
                    //2 means a change in position and size.
    deferred: true, //true when pending changes have been applied.
                    //to the window.
    height: 2,      //the new height of the window.
    left: 2,        //the left-most coordinate of the window.
    name: "windowName", //(string) the name of the window.
    top: 2,         //the top-most coordinate of the window.
    topic: "window",
    type: "bounds-changed",
    uuid: "appUUID",//the UUID of the application the window belongs to.
    width: 2        //the new width of the window.
}
```

#### bounds-changing
Generated during changes to a window's size and/or position.
```js
//This response has the following shape:
{
    changeType: 2,  //describes what kind of change occurred.
                    //0 means a change in position.
                    //1 means a change in size.
                    //2 means a change in position and size.
    deferred: true, //true when pending changes have been applied.
                    //to the window.
    height: 2,      //the new height of the window.
    left: 2,        //the left-most coordinate of the window.
    name: "windowName", //(string) the name of the window.
    top: 2,         //the top-most coordinate of the window.
    topic: "window",
    type: "bounds-changing",
    uuid: "appUUID",//the UUID of the application the window belongs to.
    width: 2        //the new width of the window.
}
```

#### close-requested
Generated when a window has been prevented from closing. A window will be prevented from closing by default, either through the API or by a user when ‘close-requested’ has been subscribed to and the Window.close(force) flag is false.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "close-requested",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### closed
Generated when a window has closed.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "closed",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### closing
Generated when a window has initiated the closing routine.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "closing",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### crashed
Generated when a window has crashed.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    reason: "killed", //possible values:
                      //  "normal-termination"    zero exit status
                      //  "abnormal-termination"  non-zero exit status
                      //  "killed"                e.g. SIGKILL or task manager kill
                      //  "crashed"               e.g. Segmentation fault
                      //  "still-running"         child hasn't exited yet
                      //  "launch-failed"         child process never launched
                      //  "out-of-memory"         process died due to oom
    topic: "window",
    type: "crashed",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### disabled-movement-bounds-changed
Generated after a change to a window's size and/or position is attempted while window movement is disabled.
```js
//This response has the following shape:
{
    changeType: 2,  //describes what kind of change occurred.
                    //0 means a change in position.
                    //1 means a change in size.
                    //2 means a change in position and size.
    deferred: true, //true when pending changes have been applied.
                    //to the window.
    height: 2,      //the new height of the window.
    left: 2,        //the left-most coordinate of the window.
    name: "windowName", //(string) the name of the window.
    top: 2,         //the top-most coordinate of the window.
    topic: "window",
    type: "disabled-movement-bounds-changed",
    uuid: "appUUID",//the UUID of the application the window belongs to.
    width: 2        //the new width of the window.
}
```

#### disabled-movement-bounds-changing
Generated while a change to a window's size and/or position is attempted while window movement is disabled.
```js
//This response has the following shape:
{
    changeType: 2,  //describes what kind of change occurred.
                    //0 means a change in position.
                    //1 means a change in size.
                    //2 means a change in position and size.
    deferred: true, //true when pending changes have been applied.
                    //to the window.
    height: 2,      //the new height of the window.
    left: 2,        //the left-most coordinate of the window.
    name: "windowName", //(string) the name of the window.
    top: 2,         //the top-most coordinate of the window.
    topic: "window",
    type: "disabled-movement-bounds-changing",
    uuid: "appUUID",//the UUID of the application the window belongs to.
    width: 2        //the new width of the window.
}
```

#### embedded
Generated when a window has been embedded.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "window-embedded",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### end-user-bounds-changing
Generated at the end of a user-driven change to a window's size or position.
```js
{

    height: 2,      //the height of the window prior to change.
    left: 2,        //the left-most coordinate of the window prior to change.
    name: "windowName", //(string) the name of the window.
    top: 2,         //the top-most coordinate of the window prior to change.
    topic: "window",
    type: "end-user-bounds-changing",
    uuid: "appUUID",//the UUID of the application the window belongs to.
    width: 2,       //the width of the window prior to change.
    windowState: "normal" // the state of the window: "minimized", "normal", or "maximized"
}
```

#### external-process-exited
Generated when an external process has exited.
```js
//This response has the following shape:
{
    exitCode: 0, // the process exit code
    name: "windowOne", //the name of the window.
    processUuid: "3BAA4DA8-DBD6-4592-8C21-6427385911D2", // the process handle uuid
    topic: "window",
    type: "external-process-exited",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### external-process-started
Generated when an external process has started.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    processUuid: "3BAA4DA8-DBD6-4592-8C21-6427385911D2", // the process handle uuid
    topic: "window",
    type: "external-process-started",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### file-download-completed
Generated when a file download has completed.
```js
//This response has the following shape:
{
    type: "file-download-completed",
    state: "started" | "completed" | "cancelled" |  "interrupted" | "paused" | "interrupted" | "paused"
    url: "https://download-location/file.pdf", //the url where the file is being downloaded from.
    mimeType: "application/pdf", //the file mime type.
    fileName: "file(1).pdf", //the name of the file as chosen by the user.
    originalFileName: "file.pdf", //the original name of the file.
    totalBytes: 347110, //the total size in bytes of the file.
    startTime: 1537994725.335115, //the number of seconds since the UNIX epoch when the download was started.
    contentDisposition: "", //the Content-Disposition field from the response header.
    lastModifiedTime: "Fri, 24 Aug 2018 03:12:32 GMT", //the Last-Modified header value.
    eTag: `W"54be6-16569eb4bad"`, //the ETag header value.
    downloadedBytes: 347110, //the downloaded bytes of the download item.
    topic: 'window',
    uuid: "AppUUID", //(string) the UUID of the application the window belongs to.
    name: "windowOne" //the name of the window.
}
```

#### file-download-progress
Generated during file download progress.
```js
//This response has the following shape:
{
    type: "file-download-progress",
    state: "started" | "completed" | "cancelled" |  "interrupted" | "paused" | "interrupted" | "paused"
    url: "https://download-location/file.pdf", //the url where the file is being downloaded from.
    mimeType: "application/pdf", //the file mime type.
    fileName: null, //the name of the file as chosen by the user, can be null for progress events.
    originalFileName: "file.pdf", //the original name of the file.
    totalBytes: 347110, //the total size in bytes of the file.
    startTime: 1537994725.335115, //the number of seconds since the UNIX epoch when the download was started.
    contentDisposition: "", //the Content-Disposition field from the response header.
    lastModifiedTime: "Fri, 24 Aug 2018 03:12:32 GMT", //the Last-Modified header value.
    eTag: `W"54be6-16569eb4bad"`, //the ETag header value.
    downloadedBytes: 23820, //the downloaded bytes of the download item.
    topic: 'window',
    uuid: "AppUUID", //(string) the UUID of the application the window belongs to.
    name: "windowOne" //the name of the window.
}
```

#### file-download-started
Generated when a file download has started.
```js
//This response has the following shape:
{
    type: "file-download-started",
    state: "started" | "completed" | "cancelled" |  "interrupted" | "paused" | "interrupted" | "paused"
    url: "https://download-location/file.pdf", //the url where the file is being downloaded from.
    mimeType: "application/pdf", //the file mime type.
    fileName: null, //the name of the file as chosen by the user, will be null for started events
    originalFileName: "file.pdf", //the original name of the file.
    totalBytes: 347110, //the total size in bytes of the file.
    startTime: 1537994725.335115, //the number of seconds since the UNIX epoch when the download was started.
    contentDisposition: "", //the Content-Disposition field from the response header.
    lastModifiedTime: "Fri, 24 Aug 2018 03:12:32 GMT", //the Last-Modified header value.
    eTag: `W"54be6-16569eb4bad"`, //the ETag header value.
    downloadedBytes: 23820, //the downloaded bytes of the download item.
    topic: 'window',
    uuid: "AppUUID", //(string) the UUID of the application the window belongs to.
    name: "windowOne" //the name of the window.
}
```

#### focused
Generated when a window receives focus.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "focused",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### group-changed
Generated when a window joins/leaves a group and/or when the group a window is a member of changes.
```js
//This response has the following shape:
{
    memberOf: "source",   //Which group array the window that the event listener was registered on is included in:
                          //'source' The window is included in sourceGroup.
                          //'target' The window is included in targetGroup.
                          //'nothing' The window is not included in sourceGroup nor targetGroup.
    name: "windowName",   //the name of the window.
    reason: "merge",      //The reason this event was triggered.
                          //'leave' A window has left the group due to a leave or merge with group.
                          //'join' A window has joined the group.
                          //'merge' Two groups have been merged together.
                          //'disband' There are no other windows in the group.
    sourceGroup: [ //All the windows in the group the sourceWindow originated from.
        {
            appUuid: "appUUID", //The UUID of the application this window entry belongs to.
            windowName: "windowName" //The name of this window entry.
        }
    ],
    sourceWindowAppUuid: "appUUID", //The UUID of the application the sourceWindow belongs to The source window is the window in which (merge/join/leave)group(s) was called.
    sourceWindowName: "sourceWindowName", //the name of the sourceWindow. The source window is the window in which (merge/join/leave)group(s) was called.
    targetGroup: [ //All the windows in the group the targetWindow originated from
        {
            appUuid: "appUUID", //The UUID of the application this window entry belongs to.
            windowName: "windowName" //The name of this window entry.
        }
    ],
    targetWindowAppUuid: "targetWindowUUID", //The UUID of the application the targetWindow belongs to. The target window is the window that was passed into (merge/join)group(s).
    targetWindowName: "targetWindowName",  //The name of the targetWindow. The target window is the window that was passed into (merge/join)group(s).
    topic: "window",
    type: "group-changed",
    uuid: "applicationUUID" //The UUID of the application the window belongs to.
}
```

#### hidden
Generated when a window has been hidden.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    reason: "hide", //What action prompted the close The reasons are:
                    //"closing" if the event is triggered by close of the window
                    //"hide"
                    //"hide-on-close"
    topic: "window",
    type: "hidden",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### initialized
Generated when a window is initialized.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "initialized",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### maximized
Generated when a window is maximized.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "maximized",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### minimized
Generated when a window is minimized.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "minimized",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### options-changed
Generated after window options are changed using the window.updateOptions method. Will not fire if the diff object is empty.
```js
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "options-changed",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
    diff: { // an object containing all changed options.
        "opacity": {   // a valid window option name
            oldVal: 0.5,
            newVal: 0.7
        },
        "minHeight": {
            oldVal: 300,
            newVal: 400
        }
    },
    options: { // The updated options object.
        opacity: 0.7,
        minHeight: 300,
        maxHeight: 600
        // ...
    },
    invalidOptions: ['someInvalidOptionName'] // A list of invalid option names in the call
}
```

#### navigation-rejected
Generated when window navigation is rejected as per ContentNavigation whitelist/blacklist rules.
```js
{
    name: "windowOne", //the name of the window.
    sourceName: "source of navigation window name",
    topic: "window",
    type: "navigation-rejected",
    url: "http://blocked-content.url",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### preload-scripts-state-changed
Generated after the execution of all of a window's preload scripts. Contains information about all window's preload scripts' final states.
```js
//This response has the following shape:
{
    name: "windowOne",              // the name of the window
    topic: "window",
    type: "preload-scripts-state-changed",
    uuid: "AppUUID",                // the UUID of the application the window belongs to
    preloadScripts: [{              // an array of all final preload scripts' states
        ...,                        // original preload script's properties
        state: 'load-failed'|       // preload script failed to load
               'failed'|            // preload script failed to eval
               'succeeded'          // preload script eval'ed successfully
    }, ...]
}
```

#### preload-scripts-state-changing
Generated during the execution of a window's preload script. Contains information about a single window's preload script's state, for which the event has been raised.
```js
//This response has the following shape:
{
    name: "windowOne",              // the name of the window
    topic: "window",
    type: "preload-scripts-state-changing",
    uuid: "AppUUID",                // the UUID of the application the window belongs to
    preloadScripts: [{              // an array of a single preload script's state change
        ...,                        // original preload script's properties
        state: 'load-started'|      // started loading preload script
               'load-failed'|       // preload script failed to load
               'load-succeeded'|    // preload script is loaded and ready to be eval'ed
               'failed'|            // preload script failed to eval
               'succeeded'          // preload script eval'ed successfully
    }]
}
```

#### reloaded
Generated when a window has been reloaded
```javascript
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "reloaded",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
    url: "http://localhost:8080/index.html" //the url has has been reloaded.
}
```

#### resource-load-failed
Generated when an HTTP load was cancelled or failed.
```js
{
    name: "windowName",
    topic: "window",
    type: "resource-response-received",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52", //the UUID of the application
    errorCode: -102,                              //the Chromium error code
    errorDescription: "",
    validatedURL: "http://bad-domain/dead-link.html",
    isMainFrame: true
}
```

#### resource-response-received
Generated when an HTTP resource request has received response details.
```js
{
    name: "windowName",
    topic: "window",
    type: "resource-response-received",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52", //the UUID of the application
    status: false,
    newUrl: "https://www.google.com/?gws_rd=ssl", //the URL of the responded resource
    originalUrl: "http://www.google.com/",        //the requested URL
    httpResponseCode: 200,
    requestMethod: "GET",
    referrer: "",                                 //the URL of the referrer
    headers: {                                    //HTTP response headers
        "cache-control": [
            "private, max-age=0"
        ],
        "content-type": [
            "text/html; charset=UTF-8"
        ]
    },
    resourceType: "mainFrame"                     //"mainFrame", "subFrame",
                                                  //"styleSheet", "script", "image",
                                                  //"object", "xhr", or "other"
}
```

#### restored
Generated when a window is displayed after having been minimized or when a window leaves the maximize state without minimizing.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "restored",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### show-requested
Generated when a window has been prevented from showing. A window will be prevented from showing by default, either through the API or by a user when ‘show-requested’ has been subscribed to on the window or 'window-show-requested' on the parent application and the Window.show(force) flag is false.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "show-requested",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### shown
Generated when a hidden window has been shown.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "shown",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### user-movement-disabled
Generated when a window's user movement becomes disabled.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "user-movement-disabled",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### user-movement-enabled
Generated when a window's user movement becomes enabled.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "window",
    type: "user-movement-enabled",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
}
```

#### view-attached
Generated when a window has a view attached to it.
```js
//This response has the following shape:
{
    name: "windowOne" // the name of this Window
    previousTarget: {uuid: 'previousWindowUuid', name: 'previousWindowName'}, // the identity of the window this BrowserView is being detached from
    target: {uuid: 'windowUuid', name: 'windowOne'}, // the identity of the window this BrowserView is attaching to
    topic: "window",
    type: "view-attached",
    uuid: "AppUUID" // the UUID of the application this window belongs to.
    viewIdentity: {uuid: 'viewUuid', name: 'viewName'}, // the identity of the BrowserView
}
```

#### view-detached
Generated when a window has a view detached from it.
```js
//This response has the following shape:
{
    name: "windowOne" // the name of this Window
    previousTarget: {uuid: 'previousWindowUuid', name: 'previousWindowName'}, // the identity of the window this BrowserView is being detached from
    target: {uuid: 'windowUuid', name: 'windowOne'}, // the identity of the window this BrowserView is attaching to
    topic: "window",
    type: "view-attached",
    uuid: "AppUUID" // the UUID of the application this window belongs to.
    viewIdentity: {uuid: 'viewUuid', name: 'viewName'}, // the identity of the BrowserView
}
```

#### will-move
Generated when a window is moved by the user.  For use with monitor scaling that is not 100%.  Bounds are given in physical pixels (not adjusted for monitor scale factor).
```js
//This response has the following shape:
{
    height: 300,      //the new height of the window.
    left: 300,        //the left-most coordinate of the window.
    monitorScaleFactor: 1.5 //the scaling factor of the monitor
    name: "windowName", //(string) the name of the window.
    top: 300,         //the top-most coordinate of the window.
    topic: "window",
    type: "will-move",
    uuid: "appUUID",  //the UUID of the application the window belongs to.
    width: 300        //the new width of the window.
}
```

#### will-resize
Generated when a window is resized by the user.  For use with monitor scaling that is not 100%.  Bounds are given in physical pixels (not adjusted for monitor scale factor).  The event will fire when a user resize is blocked by window options such as maxWidth or minHeight but not if the window is not resizable.  
```js
//This response has the following shape:
{
    height: 300,      //the new height of the window.
    left: 300,        //the left-most coordinate of the window.
    monitorScaleFactor: 1.5 //the scaling factor of the monitor
    name: "windowName", //(string) the name of the window.
    top: 300,         //the top-most coordinate of the window.
    topic: "window",
    type: "will-resize",
    uuid: "appUUID",  //the UUID of the application the window belongs to.
    width: 300        //the new width of the window.
}
```
#### performance-report
Generated when window finishes loading. Provides performance and navigation data.
```js
//This response has the following shape:
{
    topic: "window",
    type: "performance-report",
    uuid: "appUUID", //(string) the UUID of the application the window belongs to.
    name: "windowName",
    navigation: {
        redirectCount: 0,
        type: 0
    },
    timeOrigin: 1561991787065.651,
    timing: {
        connectEnd: 0,
        connectStart: 0,
        domComplete: 1561991787504,
        domContentLoadedEventEnd: 1561991787503,
        domContentLoadedEventStart: 1561991787503,
        domInteractive: 1561991787503,
        domLoading: 1561991787283,
        domainLookupEnd: 0,
        domainLookupStart: 0,
        fetchStart: 0,
        loadEventEnd: 0,
        loadEventStart: 1561991787504,
        navigationStart: 1561991787065,
        redirectEnd: 0,
        redirectStart: 0,
        requestStart: 0,
        responseEnd: 1561991787282,
        responseStart: 0,
        secureConnectionStart: 0,
        unloadEventEnd: 0,
        unloadEventStart: 0
    }
}
```
