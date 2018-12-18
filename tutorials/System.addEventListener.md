Registers an event listener on the specified event. Supported system event types are:

* application-closed
* application-connected (see {@tutorial Application.addEventListener})
* application-crashed
* application-created
* application-initialized (see {@tutorial Application.addEventListener})
* application-manifest-changed (see {@tutorial Application.addEventListener})
* application-not-responding (see {@tutorial Application.addEventListener})
* application-responding (see {@tutorial Application.addEventListener})
* application-run-requested (see {@tutorial Application.addEventListener})
* application-started
* application-tray-icon-clicked (see {@tutorial Application.addEventListener})
* desktop-icon-clicked
* idle-state-changed
* monitor-info-changed
* session-changed
* window-blurred
* window-bounds-changed (see {@tutorial Window.addEventListener})
* window-bounds-changing (see {@tutorial Window.addEventListener})
* window-closed
* window-closing
* window-crashed
* window-created
* window-disabled-movement-bounds-changed (see {@tutorial Window.addEventListener})
* window-disabled-movement-bounds-changing (see {@tutorial Window.addEventListener})
* window-embedded (see {@tutorial Window.addEventListener})
* window-end-load (see {@tutorial Window.addEventListener})
* window-external-process-exited (see {@tutorial Window.addEventListener})
* window-external-process-started (see {@tutorial Window.addEventListener})
* window-file-download-completed (see {@tutorial Window.addEventListener})
* window-file-download-progress (see {@tutorial Window.addEventListener})
* window-file-download-started (see {@tutorial Window.addEventListener})
* window-focused
* window-group-changed (see {@tutorial Window.addEventListener})
* window-hidden (see {@tutorial Window.addEventListener})
* window-initialized (see {@tutorial Window.addEventListener})
* window-maximized (see {@tutorial Window.addEventListener})
* window-minimized (see {@tutorial Window.addEventListener})
* window-navigation-rejected (see {@tutorial Window.addEventListener})
* window-not-responding (see {@tutorial Window.addEventListener})
* window-preload-scripts-state-changed (see {@tutorial Window.addEventListener})
* window-preload-scripts-state-changing (see {@tutorial Window.addEventListener})
* window-reloaded (see {@tutorial Window.addEventListener})
* window-responding (see {@tutorial Window.addEventListener})
* window-restored (see {@tutorial Window.addEventListener})
* window-shown (see {@tutorial Window.addEventListener})
* window-start-load (see {@tutorial Window.addEventListener})
* window-user-movement-disabled (see {@tutorial Window.addEventListener})
* window-user-movement-enabled (see {@tutorial Window.addEventListener})

### Example

```js
// The below functions are provided to add an event listener.
fin.System.addListener('monitor-info-changed', (evnt) => {
    console.log("The monitor information has changed to: ", evnt);
});

fin.System.on('monitor-info-changed', (evnt) => {
    console.log("The monitor information has changed to: ", evnt);
});

fin.System.once('monitor-info-changed', (evnt) => {
    console.log("The monitor information has changed to: ", evnt);
});

fin.System.prependListener('monitor-info-changed', (evnt) => {
    console.log("The monitor information has changed to: ", evnt);
});

fin.System.prependOnceListener('monitor-info-changed', (evnt) => {
    console.log("The monitor information has changed to: ", evnt);
});
```

### System Events

#### application-closed
Generated when an application has closed.
```js
//This response has the following shape:
{
    topic: "system",
    type: "application-closed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### application-crashed
Generated when an application has crashed.
```js
//This response has the following shape:
{
    topic: "system",
    type: "application-crashed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### application-created
Generated when an application is created.
```js
//This response has the following shape:
{
    topic: "system",
    type: "application-created",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### application-started
Generated when an application has started.
```js
//This response has the following shape:
{
    topic: "system",
    type: "application-started",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### external-application-connected
Generated when an external application has connected
```js
 {
    topic: "system",
    type: "external-application-connected",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the external application
}
```

#### external-application-disconnected
Generated when an external application has disconnected
```js
 {
    topic: "system",
    type: "external-application-disconnected",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the external application
}
```

#### desktop-icon-clicked
Generated when the desktop icon is clicked while it's already running.
```js
//This response has the following shape:
{
    mouse: {
        left: 13, //the left virtual screen coordinate of the mouse
        top: 14  // the top virtual screen coordinate of the mouse
    },
    tickCount: 233000, //the number of milliseconds that have elapsed since the system was started,
    topic: "system",
    type: "desktop-icon-clicked",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application launching
}
```

#### idle-state-changed
Generated when a user enters or returns from idle state. This method is continuously generated every minute while the user is in idle. A user enters idle state when the computer is locked or when there has been no keyboard/mouse activity for 1 minute. A user returns from idle state when the computer is unlocked or keyboard/mouse activity has resumed.
```js
//This response has the following shape:
{
    elapsedTime: 6000, //How long in milliseconds since the user has been idle.
    isIdle: true, //true when the user is idle,false when the user has returned;
    topic: "system",
    type: "idle-state-changed"
}
```

#### monitor-info-changed
Generated on changes of a monitor's size/location. A monitor's size changes when the taskbar is resized or relocated. The available space of a monitor defines a rectangle that is not occupied by the taskbar.
```js
//This response has the following shape:
{
    nonPrimaryMonitors: [{
        availableRect: {
            bottom: 55, //bottom-most available monitor coordinate,
            left: 55, //left-most available monitor coordinate,
            right: 55, //right-most available monitor coordinate,
            top: 55 //top-most available monitor coordinate
        },
        deviceId: "device", //device id of the display
        displayDeviceActive: true, //true if the display is active
        monitorRect: {
            bottom: 55, //bottom-most monitor coordinate,
            left: 55, //left-most monitor coordinate,
            right: 55, //right-most monitor coordinate,
            top: 55 //top-most monitor coordinate
        },
        name: "display two" //name of the display
    }],
    primaryMonitor: {
        availableRect: {
            bottom: 55, //bottom-most available monitor coordinate,
            left: 55, //left-most available monitor coordinate,
            right: 55, //right-most available monitor coordinate,
            top: 55 //top-most available monitor coordinate
        },
        deviceId: "device", //device id of the display
        displayDeviceActive: true, //true if the display is active
        monitorRect: {
            bottom: 55, //bottom-most monitor coordinate,
            left: 55, //left-most monitor coordinate,
            right: 55, //right-most monitor coordinate,
            top: 55 //top-most monitor coordinate
        },
        name: "display one" //name of the display
    },
    reason: "display", //the action that triggered this event. Can be "taskbar", "display" or "unknown"
    taskbar: {
        edge: "top" // which edge of a monitor the taskbar is on,
        rect: {
            bottom: 55, //bottom-most coordinate of the taskbar
            left: 55, //left-most coordinate of the taskbar
            right: 55, //right-most coordinate of the taskbar
            top: 55 //top-most coordinate of the taskbar
        }
    },
    topic: "system",
    type: "monitor-info-changed",
    virtualScreen: {
        bottom: 55, //bottom-most coordinate of the virtual screen,
        left: 55, //left-most coordinate of the virtual screen,
        right: 55, //right-most coordinate of the virtual screen,
        top: 55 //top-most coordinate of the virtual screen
    }
}
```

#### session-changed
Generated on changes to a user’s local computer session.
```js
//This response has the following shape:
{
    reason: "lock", //the action that triggered this event:
                    //"lock"
                    //"unlock"
                    //"remote-connect"
                    //"remote-disconnect"
                    //"unknown"
    topic: "system",
    type: "session-changed"
}
```

#### window-blurred
Generated when a window loses focus.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "system",
    type: "window-blurred",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-closed
Generated when a window closes.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "system",
    type: "window-closed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-closing
Generated when a window has initiated the closing routine.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "system",
    type: "window-closing",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-crashed
Generated when a window crashes.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "system",
    type: "window-crashed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-created
Generated when a window is created.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "system",
    type: "window-created",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```

#### window-focused
Generated when a window gains focus.
```js
//This response has the following shape:
{
    name: "windowName",
    topic: "system",
    type: "window-focused",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the UUID of the application
}
```
