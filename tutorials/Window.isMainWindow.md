Determines if the window is a main window.
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
const wnd = fin.Window.getCurrentSync();
const isMainWnd = wnd.isMainWindow();
console.log('Is this a main window? ' + isMainWnd);
```
