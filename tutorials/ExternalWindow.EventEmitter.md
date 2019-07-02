When an instance of `fin.ExternalWindow` is created, it inherits an `EventEmitter` with the below methods so that it is possible to listen to OpenFin events. The below methods are asynchronous as they must cross process boundaries and setup the listener in the external window.  When the `EventEmitter` receives an event from the browser process and emits on the renderer, all of the functions attached to that specific event are called synchronously.  Any values returned by the called listeners are ignored and will be discarded.
It is important to keep in mind that when an ordinary listener function is called, the standard `this` keyword is intentionally set to reference the `EventEmitter` instance to which the listener is attached.  It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the `EventEmitter` instance.

#### {@link Window#addListener addListener(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const externalWindows = await fin.System.getAllExternalWindows();
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

const callback = await notepadWin.addListener("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#on on(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const externalWindows = await fin.System.getAllExternalWindows(); 
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

const callback = await notepadWin.on("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#once once(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
```js
const externalWindows = await fin.System.getAllExternalWindows(); 
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

const callback = await notepadWin.once("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#prependListener prependListener(event, listener)}
Adds a listener to the beginning of the listeners array for the specified event.
```js
const externalWindows = await fin.System.getAllExternalWindows(); 
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

const callback = await notepadWin.prependListener("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#prependOnceListener prependOnceListener(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed. The listener is added to the beginning of the listeners array.
```js
const externalWindows = await fin.System.getAllExternalWindows(); 
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

const callback = await notepadWin.prependOnceListener("bounds-changed", function(event) {
    console.log("The window has been moved or resized.");
});
```

#### {@link Window#removeListener removeListener(event, listener)}
Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
```js
const externalWindows = await fin.System.getAllExternalWindows(); 
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

const callback = await function(event) {
    // ... do something once
    notepadWin.removeListener("bounds-changed", callback);
};

notepadWin.on("bounds-changed", callback);
```

#### {@link Window#removeAllListeners removeAllListeners([event])}
Removes all listeners, or those of the specified event.
```js
const externalWindows = await fin.System.getAllExternalWindows(); 
const notepadWin = externalWindows.find(win => win.name === 'Notepad'); // assuming only one instance of notepad is open

notepadWin.removeAllListeners("bounds-changed");
```

### Supported external window event types
* begin-user-bounds-changing
* blurred
* bounds-changed
* bounds-changing
* closed
* closing
* disabled-movement-bounds-changed
* disabled-movement-bounds-changing
* end-user-bounds-changing
* focused
* group-changed
* hidden
* maximized
* minimized
* restored
* shown
* user-movement-disabled
* user-movement-enabled

### External Window Events

#### begin-user-bounds-changing
Generated at the beginning of a user-driven change to an external window's size or position.
```js
{
    frame: true,
    height: 581,            // the height of the window prior to change.
    left: 274,              // the left-most coordinate of the window prior to change.
    name: "Notepad",        // (string) the name of the window.
    top: 235,               // the top-most coordinate of the window prior to change.
    topic: "external-window",
    type: "begin-user-bounds-changing",
    uuid: "0x001804C0",     // A generated openfin UUID for the external window
    width: 1231,
    windowState: "normal",  // the state of the window: "minimized", "normal", or "maximized"
    x: 274,
    y: 235
}
```

#### blurred
Generated when an external window loses focus.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "blurred",
    uuid: "AppUUID" // A generated openfin UUID for the external window
}
```

#### bounds-changed
Generated after changes in an external window's size and/or position.
```js
//This response has the following shape:
{
    changeType: 0       // describes what kind of change occurred.
                            // 0 means a change in position.
                            // 1 means a change in size.
                            // 2 means a change in position and size.
    deferred: false     // true when pending changes have been applied.
    height: 440         // the new height of the window.
    left: 158           // the left-most coordinate of the window.
    name: "Notepad"     // (string) the name of the window.
    reason: "self"      //  the reason for the bounds change: 'animation' | 'group-animation' | 'self' | 'group'      
    top: 36             //the top-most coordinate of the window.
    topic: "external-window"
    type: "bounds-changed"
    uuid: "0x001B04C0"  // A generated openfin UUID for the external window
    width: 1231         //the new width of the window.
}
```

#### bounds-changing
Generated during changes to an external window's size and/or position.
```js
//This response has the following shape:
{
    changeType: 0       // describes what kind of change occurred.
                            // 0 means a change in position.
                            // 1 means a change in size.
                            // 2 means a change in position and size.
    deferred: false     // true when pending changes have been applied.
    height: 440         // the new height of the window.
    left: 158           // the left-most coordinate of the window.
    name: "Notepad"     // (string) the name of the window.
    reason: "self"      //  the reason for the bounds change: 'animation' | 'group-animation' | 'self' | 'group'      
    top: 36             //the top-most coordinate of the window.
    topic: "external-window"
    type: "bounds-changed"
    uuid: "0x001B04C0"  // A generated openfin UUID for the external window
    width: 1231         //the new width of the window.
}
```

#### closed
Generated when an external window has closed.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "closed",
    uuid: "AppUUID" // A generated openfin UUID for the external window
}
```

#### closing
Generated when an external window has initiated the closing routine.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "closing",
    uuid: "AppUUID" // A generated openfin UUID for the external window
}
``` 

#### disabled-movement-bounds-changed
Generated after a change to an external window's size and/or position is attempted while window movement is disabled.
```js
//This response has the following shape:
{
    changeType: 2,  //describes what kind of change occurred.
                    //0 means a change in position.
                    //1 means a change in size.
                    //2 means a change in position and size.
    deferred: false, //true when pending changes have been applied.
                    //to the window.
    height: 2,      //the new height of the window.
    name: "windowName", //(string) the name of the window.
    topic: "external-window",
    type: "disabled-movement-bounds-changed",
    uuid: "appUUID",// A generated openfin UUID for the external window
    width: 2        //the new width of the window.
}
```

#### disabled-movement-bounds-changing
Generated while a change to an external window's size and/or position is attempted while window movement is disabled.
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
    topic: "external-window",
    type: "disabled-movement-bounds-changing",
    uuid: "appUUID",// A generated openfin UUID for the external window
    width: 2        //the new width of the window.
}
```

#### end-user-bounds-changing
Generated at the end of a user-driven change to an external window's size or position.
```js
{
    frame: true,
    height: 525,            //the height of the window prior to change.
    left: 365,              //the left-most coordinate of the window prior to change.
    name: "Notepad",        //(string) the name of the window.
    top: 395,               //the top-most coordinate of the window prior to change.
    topic: "external-window",
    type: "end-user-bounds-changing",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
    width: 778,             //the width of the window prior to change.
    windowState: "normal",  // the state of the window: "minimized", "normal", or "maximized"
    x: 365,
    y: 395
}
```

#### focused
Generated when an external window receives focus.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "focused",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### group-changed
Generated when an external window joins/leaves a group and/or when the group an external window is a member of changes.
```js
//This response has the following shape:
{
    memberOf: "source",   //Which group array the window that the event listener was registered on is included in:
                          //'source' The window is included in sourceGroup.
                          //'target' The window is included in targetGroup.
                          //'nothing' The window is not included in sourceGroup nor targetGroup.
    name: "windowName",   //the name of the window.
    reason: "merge",      //The reason this event was triggered.
                          //'leave' an external window has left the group due to a leave or merge with group.
                          //'join' an external window has joined the group.
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
    topic: "external-window",
    type: "group-changed",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### hidden
Generated when an external window has been hidden.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    reason: "hide", //What action prompted the close The reasons are:
                    //"closing" if the event is triggered by close of the window
                    //"hide"
                    //"hide-on-close"
    topic: "external-window",
    type: "hidden",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### maximized
Generated when an external window is maximized.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "maximized",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### minimized
Generated when an external window is minimized.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "minimized",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### restored
Generated when an external window is displayed after having been minimized or when an external window leaves the maximize state without minimizing.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "restored",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### shown
Generated when a hidden external window has been shown.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "shown",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### user-movement-disabled
Generated when an external window's user movement becomes disabled.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "user-movement-disabled",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```

#### user-movement-enabled
Generated when an external window's user movement becomes enabled.
```js
//This response has the following shape:
{
    name: "windowOne", //the name of the window.
    topic: "external-window",
    type: "user-movement-enabled",
    uuid: "0x000B0160",     // A generated openfin UUID for the external window
}
```
