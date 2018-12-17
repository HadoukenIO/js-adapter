Removes the specified listener from the listener array for the specified event type. Supported external application event types are:

* connected
* disconnected

### Example

```js
let externalApp = fin.ExternalApplication.wrapSync('my-uuid');

const callback = (event) => {
  console.log('The external application connected');
};

externalApp.on('connected', callback);

externalApp.removeListener("connected", callback);
```
