Asynchronously returns a Window object that represents the current window
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
fin.Window.getCurrent()
.then(wnd => console.log('current window'))
.catch(err => console.log(err));

```
