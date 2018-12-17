Removes the specified listener from the listener array for the specified event type.

### Example

```js
const application = fin.Application.getCurrentSync();
const callback = (event) => {
  console.log('The application closed');
};

server.on('closed', callback);

application.removeListener("closed", callback);
```
