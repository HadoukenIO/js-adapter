When an instance of `fin.Application` is created, it inherits an `EventEmitter` with the below methods so that it is possible to listen to OpenFin events. The below methods are asynchronous as they must cross process boundaries and setup the listener in the browser process.  When the `EventEmitter` receives an event from the browser process and emits on the renderer, all of the functions attached to that specific event are called synchronously.  Any values returned by the called listeners are ignored and will be discarded.  If the execution context of the window is destroyed by page navigation or reload, any events that have been setup in that context will be destroyed.
It is important to keep in mind that when an ordinary listener function is called, the standard `this` keyword is intentionally set to reference the `EventEmitter` instance to which the listener is attached.  It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the `EventEmitter` instance.

#### {@link Application#addListener addListener(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const app = await fin.Application.getCurrent();

app.addListener("closed", function(event) {
    console.log("The application has closed.");
});
```

#### {@link Application#on on(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const app = await fin.Application.getCurrent();

app.on("closed", function(event) {
    console.log("The application has closed.");
});
```

#### {@link Application#once once(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
```js
const app = await fin.Application.getCurrent();

app.once("closed", function(event) {
    console.log("The application has closed.");
});
```

#### {@link Application#prependListener prependListener(event, listener)}
Adds a listener to the beginning of the listeners array for the specified event.
```js
const app = await fin.Application.getCurrent();

app.prependListener("closed", function(event) {
    console.log("The application has closed.");
});
```

#### {@link Application#prependOnceListener prependOnceListener(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed. The listener is added to the beginning of the listeners array.
```js
const app = await fin.Application.getCurrent();

app.prependListener("closed", function(event) {
    console.log("The application has closed.");
});
```

#### {@link Application#removeListener removeListener(event, listener)}
Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
```js
const app = await fin.Application.getCurrent();
const callback = function(event) {
  console.log('The application closed');
};

app.on('closed', callback);
app.removeListener("closed", callback);
```

#### {@link Application#removeAllListeners removeAllListeners([event])}
Removes all listeners, or those of the specified event.
```js
const app = await fin.Application.getCurrent();
app.removeAllListeners("closed");
```

### Supported application event types

* closed
* connected
* crashed
* initialized
* manifest-changed
* not-responding
* responding
* run-requested
* started
* tray-icon-clicked
* window-alert-requested
* window-auth-requested
* window-blurred
* window-bounds-changed (see {@tutorial Window.EventEmitter})
* window-bounds-changing (see {@tutorial Window.EventEmitter})
* window-closed
* window-closing
* window-crashed
* window-created
* window-disabled-movement-bounds-changed (see {@tutorial Window.EventEmitter})
* window-disabled-movement-bounds-changing (see {@tutorial Window.EventEmitter})
* window-embedded (see {@tutorial Window.EventEmitter})
* window-end-load
* window-external-process-exited (see {@tutorial Window.EventEmitter})
* window-external-process-started (see {@tutorial Window.EventEmitter})
* window-file-download-completed (see {@tutorial Window.EventEmitter})
* window-file-download-progress (see {@tutorial Window.EventEmitter})
* window-file-download-started (see {@tutorial Window.EventEmitter})
* window-focused
* window-group-changed (see {@tutorial Window.EventEmitter})
* window-hidden (see {@tutorial Window.EventEmitter})
* window-initialized (see {@tutorial Window.EventEmitter})
* window-maximized (see {@tutorial Window.EventEmitter})
* window-minimized (see {@tutorial Window.EventEmitter})
* window-options-changed (see {@tutorial Window.EventEmitter})
* window-navigation-rejected
* window-not-responding
* window-performance-report (see {@tutorial Window.EventEmitter})
* window-preload-scripts-state-changed (see {@tutorial Window.EventEmitter})
* window-preload-scripts-state-changing (see {@tutorial Window.EventEmitter})
* window-reloaded
* window-responding
* window-restored (see {@tutorial Window.EventEmitter})
* window-show-requested
* window-shown (see {@tutorial Window.EventEmitter})
* window-start-load
* window-user-movement-disabled (see {@tutorial Window.EventEmitter})
* window-user-movement-enabled (see {@tutorial Window.EventEmitter})
* window-will-move (see {@tutorial Window.EventEmitter})
* window-will-resize (see {@tutorial Window.EventEmitter})

### Application Events

#### closed
Generated when an application is closed.
```js
//This response has the following shape:
{
    topic: "application",
    type: "closed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### connected
Generated when an application has authenticated and is connected.
```js
//This response has the following shape:
{
    topic: "application",
    type: "connected",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### crashed
Generated when an application has crashed.
```js
//This response has the following shape:
{
    reason: "killed", // possible values:
                      //   "normal-termination"    zero exit status
                      //   "abnormal-termination"  non-zero exit status
                      //   "killed"                e.g. SIGKILL or task manager kill
                      //   "crashed"               e.g. Segmentation fault
                      //   "still-running"         child hasn't exited yet
                      //   "launch-failed"         child process never launched
                      //   "out-of-memory"         process died due to oom
    topic: "application",
    type: "crashed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### initialized
Generated when an application has initialized.
```js
//This response has the following shape:
{
    topic: "application",
    type: "initialized",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### manifest-changed
Generated when the RVM notifies an application that the manifest has changed.
```js
//This response has the following shape:
{
    topic: "application",
    type: "manifest-changed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### not-responding
Generated when an application is not responding.
```js
//This response has the following shape:
{
    topic: "application",
    type: "not-responding",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### responding
Generated when an application is responding.
```js
//This response has the following shape:
{
    topic: "application",
    type: "responding",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### run-requested
Generated when Application.run() is called for an already running application.
```js
//This response has the following shape:
{
    topic: "application",
    type: "run-requested",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52", // the UUID of the application
    userAppConfigArgs: { // if URL paramaters passed to RVM '?$$abc=123&$$def=456'
        abc: "123",
        def: "456"
    }
}
```

#### started
Generated when an application has started.
```js
//This response has the following shape:
{
    topic: "application",
    type: "started",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### tray-icon-clicked
Generated when the tray icon is clicked.
```js
//This response has the following shape:
{
    button: 0, // 0 for left, 1 for middle, 2 for right
    monitorInfo: { ... }, // see the monitor-info-changed payload in the system module for details
    topic: "application",
    type: "tray-icon-clicked",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application,
    x: 123, // the cursor x coordinate
    y: 67 // the cursor y coordinate
}
```

#### window-alert-requested
Generated when an alert is fired and suppressed due to the customWindowAlert flag being true.
```js
//This response has the following shape:
{
    message: "The alert message."
    name: "windowName",
    topic: "application",
    type: "window-alert-requested",
    url: "https://openfin.co/",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-auth-requested
Generated when a window within this application requires credentials from the user.
```js
{
    name: "windowName",
    topic: "application",
    type: "window-auth-requested",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application,
    authInfo: {
        host: "myserver",
        isProxy: false,
        port: 80,
        realm: "",
        scheme: "basic"
    }

}
```

#### window-blurred
Generated when a window of the application loses focus.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-blurred",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-closed
Generated when a child window has closed.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-closed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-closing
Generated when a child window has initiated the closing routine.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-closing",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-crashed
Generated when a child window has crashed.
```js
//This response has the following shape:
{
    name: "windowName",
    reason: "killed", // possible values:
                      //   "normal-termination"    zero exit status
                      //   "abnormal-termination"  non-zero exit status
                      //   "killed"                e.g. SIGKILL or task manager kill
                      //   "crashed"               e.g. Segmentation fault
                      //   "still-running"         child hasn't exited yet
                      //   "launch-failed"         child process never launched
                      //   "out-of-memory"         process died due to oom
    topic: "application",
    type: "window-crashed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-created
Generated when a child window is created.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-created",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-end-load
Generated when a child window ends loading.
```js
//This response has the following shape:
{
    documentName: "documentName", // frame name
    isMain: true, // is this the main frame
    name: "windowName",
    topic: "application",
    type: "window-end-load",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-focused
Generated when a window of the application gains focus.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-focused",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-navigation-rejected
Generated when window navigation is rejected as per ContentNavigation whitelist/blacklist rules.
```js
{
    name: "windowName",
    sourceName: "source of navigation window name",
    topic: "window-navigation-rejected",
    url: "http://blocked-content.url",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-not-responding
Generated when a child window is not responding.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-not-responding",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-reloaded
Generated when a window has been reloaded
```javascript
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-reloaded",
    uuid: "AppUUID" //(string) the UUID of the application the window belongs to.
    url: "http://localhost:8080/index.html" //the url has has been reloaded.
}
```

#### window-responding
Generated when a child window is responding.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-responding",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-show-requested
Generated when a child window has been prevented from showing. A child window will be prevented from showing by default, either through the API or by a user when ‘show-requested’ has been subscribed to on the child window or 'window-show-requested' on the parent application and the Window.show(force) flag is false.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-show-requested",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-start-load
Generated when a child window starts loading.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "application",
    type: "window-start-load",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```
