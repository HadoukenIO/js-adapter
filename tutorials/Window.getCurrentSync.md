Synchronously returns a Window object that represents the current window
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
const wnd = fin.Window.getCurrentSync();
const info = await wnd.getInfo();
console.log(info);

```
