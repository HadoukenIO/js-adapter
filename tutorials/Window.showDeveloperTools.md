Shows the Chromium Developer Tools
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
async function showDeveloperTools() {
    const win = await fin.Window.getCurrent();
    return win.showDeveloperTools();
}

showDevelopertools()
.then(() => console.log('Showing dev tools'))
.catch(err => console.error(err));
```
