Removes a previously registered event listener from the specified event.

### Example

```js
const callback = (info) => console.log(info);
const mainWindow = await fin.Window.getCurrent(),

mainWindow.on('bounds-changed', callback);

mainWindow.removeListener("bounds-changed", callback);
```
