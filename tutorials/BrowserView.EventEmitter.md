When an instance of `fin.BrowserView` is created, it inherits an `EventEmitter` with the below methods so that it is possible to listen to OpenFin events. The below methods are asynchronous as they must cross process boundaries and setup the listener in the browser process.  When the `EventEmitter` receives an event from the browser process and emits on the renderer, all of the functions attached to that specific event are called synchronously.  Any values returned by the called listeners are ignored and will be discarded.  If the execution context of the window is destroyed by page navigation or reload, any events that have been setup in that context will be destroyed.
It is important to keep in mind that when an ordinary listener function is called, the standard `this` keyword is intentionally set to reference the `EventEmitter` instance to which the listener is attached.  It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the `EventEmitter` instance.

#### {@link BrowserView#addListener addListener(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const view = await fin.BrowserView.getCurrent();

view.addListener("closed", function(event) {
    console.log("The BrowserView has closed.");
});
```

#### {@link BrowserView#on on(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const view = await fin.BrowserView.getCurrent();

view.on("closed", function(event) {
    console.log("The BrowserView has closed.");
});
```

#### {@link BrowserView#once once(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
```js
const view = await fin.BrowserView.getCurrent();

view.once("closed", function(event) {
    console.log("The BrowserView has closed.");
});
```

#### {@link BrowserView#prependListener prependListener(event, listener)}
Adds a listener to the beginning of the listeners array for the specified event.
```js
const view = await fin.BrowserView.getCurrent();

view.prependListener("closed", function(event) {
    console.log("The BrowserView has closed.");
});
```

#### {@link BrowserView#prependOnceListener prependOnceListener(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed. The listener is added to the beginning of the listeners array.
```js
const view = await fin.BrowserView.getCurrent();

view.prependListener("closed", function(event) {
    console.log("The BrowserView has closed.");
});
```

#### {@link BrowserView#removeListener removeListener(event, listener)}
Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
```js
const view = await fin.BrowserView.getCurrent();
const callback = function(event) {
  console.log('The BrowserView closed');
};

view.on('closed', callback);
view.removeListener("closed", callback);
```

#### {@link BrowserView#removeAllListeners removeAllListeners([event])}
Removes all listeners, or those of the specified event.
```js
const view = await fin.BrowserView.getCurrent();
view.removeAllListeners("closed");
```

### Supported BrowserView event types

* created
* attached
* shown
* hidden
* destroyed

### BrowserView Events

#### created
Generated when a BrowserView is created.
```js
//This response has the following shape:
{
    name: "BrowserViewName" // the name of the BrowserView
    target: {uuid: 'windowUuid', name: 'windowName'}, // the window this BrowserView will attach to
    topic: "view",
    type: "created",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the uuid of the BrowserView
}
```

#### attached
Generated when a BrowserView attaches to a window. This event will fire during creation of a BrowserView. In that case, `previousTarget` identity will be the same as `target` identity.
```js
//This response has the following shape:
{
    name: "BrowserViewName" // the name of the BrowserView
    previousTarget: {uuid: 'previousWindowUuid', name: 'previousWindowName'}, // the window this BrowserView was previously attached to
    target: {uuid: 'windowUuid', name: 'windowName'}, // the window this BrowserView will attach to
    topic: "view",
    type: "attached",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the uuid of the BrowserView
}
```

#### shown
Generated when a BrowserView is shown. This event will fire during creation of a BrowserView.
```js
//This response has the following shape:
{
    name: "BrowserViewName" // the name of the BrowserView
    target: {uuid: 'windowUuid', name: 'windowName'}, // the window this BrowserView is attached to
    topic: "view",
    type: "shown",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the uuid of the BrowserView
}
```

#### hidden
Generated when a BrowserView is hidden.
```js
//This response has the following shape:
{
    name: "BrowserViewName" // the name of the BrowserView
    target: {uuid: 'windowUuid', name: 'windowName'}, // the window this BrowserView is attached to
    topic: "view",
    type: "hidden",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the uuid of the BrowserView
}
```

#### destroyed
Generated when a BrowserView is destroyed.
```js
//This response has the following shape:
{
    name: "BrowserViewName" // the name of the BrowserView
    target: {uuid: 'windowUuid', name: 'windowName'}, // the window this BrowserView was attached to
    topic: "view",
    type: "destroyed",
    uuid: "454C7F31-A915-4EA2-83F2-CFA655453C52" // the uuid of the BrowserView
}
```