Removes all listeners, or those of the specified event type.

### Example

```js
const mainWindow = await fin.Window.getCurrent();
mainWindow.removeAllListeners("bounds-changed");
```
