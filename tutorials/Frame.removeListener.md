Removes a listener to the referenced frame.

### Example

````js
const callback = (info) => console.log(info);
const myFrame = fin.Frame.wrapSync({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});

myFrame.on('disconnected', callback);

myFrame.removeListener("disconnected", callback);
````
