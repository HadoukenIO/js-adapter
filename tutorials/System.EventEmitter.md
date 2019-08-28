`fin.System` has inherited an `EventEmitter` with the below methods so that it is possible to listen to OpenFin events. The below methods are asynchronous as they must cross process boundaries and setup the listener in the browser process. When the `EventEmitter` receives an event from the browser process and emits on the renderer, all of the functions attached to that specific event are called synchronously. Any values returned by the called listeners are ignored and will be discarded. If the execution context of the window is destroyed by page navigation or reload, any events that have been setup in that context will be destroyed.

#### {@link System#addListener addListener(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
fin.System.addListener('monitor-info-changed', function(event) {
    console.log("The monitor information has changed to: ", event);
});
```

#### {@link System#on on(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
fin.System.on('monitor-info-changed', function(event) {
    console.log("The monitor information has changed to: ", event);
});
```

#### {@link System#once once(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
```js
fin.System.once('monitor-info-changed', function(event) {
    console.log("The monitor information has changed to: ", event);
});
```

#### {@link System#prependListener prependListener(event, listener)}
Adds a listener to the beginning of the listeners array for the specified event.
```js
fin.System.prependListener('monitor-info-changed', function(event) {
    console.log("The monitor information has changed to: ", event);
});
```

#### {@link System#prependOnceListener prependOnceListener(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed. The listener is added to the beginning of the listeners array.
```js
fin.System.prependOnceListener('monitor-info-changed', function(event) {
    console.log("The monitor information has changed to: ", event);
});
```

#### {@link System#removeListener removeListener(event, listener)}
Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
```js
const callback = function(event) {
  console.log("The monitor information has changed to: ", event);
};

fin.System.on('monitor-info-changed', callback);
fin.System.removeListener("monitor-info-changed", callback);
```

#### {@link System#removeAllListeners removeAllListeners([event])}
Removes all listeners, or those of the specified event.
```js
fin.System.removeAllListeners("monitor-info-changed");
```

### Supported system event types

* application-closed
* application-connected (see {@tutorial Application.EventEmitter})
* application-crashed
* application-created
* application-initialized (see {@tutorial Application.EventEmitter})
* application-manifest-changed (see {@tutorial Application.EventEmitter})
* application-not-responding (see {@tutorial Application.EventEmitter})
* application-responding (see {@tutorial Application.EventEmitter})
* application-run-requested (see {@tutorial Application.EventEmitter})
* application-started
* application-tray-icon-clicked (see {@tutorial Application.EventEmitter})
* desktop-icon-clicked
* idle-state-changed
* monitor-info-changed
* session-changed
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
* window-end-load (see {@tutorial Window.EventEmitter})
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
* window-navigation-rejected (see {@tutorial Window.EventEmitter})
* window-not-responding (see {@tutorial Window.EventEmitter})
* window-performance-report (see {@tutorial Window.EventEmitter})
* window-preload-scripts-state-changed (see {@tutorial Window.EventEmitter})
* window-preload-scripts-state-changing (see {@tutorial Window.EventEmitter})
* window-reloaded (see {@tutorial Window.EventEmitter})
* window-responding (see {@tutorial Window.EventEmitter})
* window-restored (see {@tutorial Window.EventEmitter})
* window-shown (see {@tutorial Window.EventEmitter})
* window-start-load (see {@tutorial Window.EventEmitter})
* window-user-movement-disabled (see {@tutorial Window.EventEmitter})
* window-user-movement-enabled (see {@tutorial Window.EventEmitter})

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
