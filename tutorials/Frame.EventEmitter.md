
When an instance of `fin.Frame` is created, it inherits an `EventEmitter` with the below methods so that it is possible to listen to OpenFin events. The below methods are asynchronous as they must cross process boundaries and setup the listener in the browser process.  When the `EventEmitter` receives an event from the browser process and emits on the renderer, all of the functions attached to that specific event are called synchronously.  Any values returned by the called listeners are ignored and will be discarded.  If the execution context of the window is destroyed by page navigation or reload, any events that have been setup in that context will be destroyed.
It is important to keep in mind that when an ordinary listener function is called, the standard `this` keyword is intentionally set to reference the `EventEmitter` instance to which the listener is attached.  It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the `EventEmitter` instance.

#### {@link Frame#addListener addListener(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

myFrame.addListener("disconnected", function(event) {
    console.log("The frame disconnected.");
});
```

#### {@link Frame#on on(event, listener)}
Adds a listener to the end of the listeners array for the specified event.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

myFrame.on("disconnected", function(event) {
    console.log("The frame disconnected.");
});
```

#### {@link Frame#once once(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

myFrame.once("disconnected", function(event) {
    console.log("The frame disconnected.");
});
```

#### {@link Frame#prependListener prependListener(event, listener)}
Adds a listener to the beginning of the listeners array for the specified event.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

myFrame.prependListener("disconnected", function(event) {
    console.log("The frame disconnected.");
});
```

#### {@link Frame#prependOnceListener prependOnceListener(event, listener)}
Adds a one time listener for the event. The listener is invoked only the first time the event is fired, after which it is removed. The listener is added to the beginning of the listeners array.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

myFrame.prependOnceListener("disconnected", function(event) {
    console.log("The frame disconnected.");
});
```

#### {@link Frame#removeListener removeListener(event, listener)}
Remove a listener from the listener array for the specified event. Caution: Calling this method changes the array indices in the listener array behind the listener.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});
const callback = function(event) {
  console.log('The frame disconnected.');
};

myFrame.on('disconnected', callback);
myFrame.removeListener("disconnected", callback);
```

#### {@link Frame#removeAllListeners removeAllListeners([event])}
Removes all listeners, or those of the specified event.
```js
const myFrame = await fin.Frame.wrap({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});
myFrame.removeAllListeners("disconnected");
```

### Supported event types are:

* connected
* disconnected

### Frame Events

#### connected
Generated when a frame is connected.
```js
//This response has the following shape:
{
    topic: "frame",
    type: "connected",
    uuid: "OpenfinPOC" // the UUID of the external application
    frameName: "2407fac7-25dc-4bba-9add-cd09b2fc078c",
    entityType: "iframe"
}
```

#### disconnected
Generated when a frame has disconnected
```js
//This response has the following shape:
{
    topic: "frame",
    type: "disconnected",
    uuid: "OpenfinPOC",
    frameName: "2407fac7-25dc-4bba-9add-cd09b2fc078c",
    entityType: "iframe"
}
```

