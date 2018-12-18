Attaches a listener to the referenced frame. Supported event types are:

* connected
* disconnected

### Example

````js
const listener = (info) => console.log(info); // see return value below
const myFrame = fin.Frame.wrapSync({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

// The below functions are provided to add an event listener.
myFrame.addListener('disconnected', listener);

myFrame.on('disconnected', listener);

myFrame.once('disconnected', listener);

myFrame.prependListener('disconnected', listener);

myFrame.prependOnceListener('disconnected', listener);

// example info shape
{
    "topic": "frame",
    "type": "disconnected",
    "uuid": "OpenfinPOC",
    "frameName": "2407fac7-25dc-4bba-9add-cd09b2fc078c",
    "entityType": "iframe"
}

````
