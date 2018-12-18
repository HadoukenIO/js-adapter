Removes a previously registered event listener from the specified event.

### Example

```js
const callback = (info) => console.log(info);

fin.System.on('monitor-info-changed', callback);

fin.System.removeListener("monitor-info-changed", callback);
```
