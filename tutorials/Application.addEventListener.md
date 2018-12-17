Registers an event listener on the specified event. Supported application event types are:

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
* window-bounds-changed (see {@tutorial window.addEventListener})
* window-bounds-changing (see {@tutorial window.addEventListener})
* window-closed
* window-closing
* window-crashed
* window-created
* window-disabled-frame-bounds-changed (see {@tutorial window.addEventListener})
* window-disabled-frame-bounds-changing (see {@tutorial window.addEventListener})
* window-embedded (see {@tutorial window.addEventListener})
* window-end-load
* window-external-process-exited (see {@tutorial window.addEventListener})
* window-external-process-started (see {@tutorial window.addEventListener})
* window-file-download-completed (see {@tutorial window.addEventListener})
* window-file-download-progress (see {@tutorial window.addEventListener})
* window-file-download-started (see {@tutorial window.addEventListener})
* window-focused
* window-frame-disabled (see {@tutorial window.addEventListener})
* window-frame-enabled (see {@tutorial window.addEventListener})
* window-group-changed (see {@tutorial window.addEventListener})
* window-hidden (see {@tutorial window.addEventListener})
* window-initialized (see {@tutorial window.addEventListener})
* window-maximized (see {@tutorial window.addEventListener})
* window-minimized (see {@tutorial window.addEventListener})
* window-navigation-rejected
* window-not-responding
* window-preload-scripts-state-changed (see {@tutorial window.addEventListener})
* window-preload-scripts-state-changing (see {@tutorial window.addEventListener})
* window-reloaded
* window-responding
* window-restored (see {@tutorial window.addEventListener})
* window-show-requested
* window-shown (see {@tutorial window.addEventListener})
* window-start-load

### Example

```js
app.on("closed", (event) => {
    console.log("The application is closed in on callback");
});

app.once("closed", (event) => {
    console.log("The application is closed in once callback");
});

app.prependListener("closed", (event) => {
    console.log("The application is closed in prependListener callback");
});

app.prependOnceListener("closed", (event) => {
    console.log("The application is closed in prependOnceListener callback");
});
```

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
