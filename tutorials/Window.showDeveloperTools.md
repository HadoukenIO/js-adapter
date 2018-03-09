Shows the Chromium Developer Tools

# Example
```js
async function showDeveloperTools() {
    const win = await fin.Window.getCurrent();
    return win.showDeveloperTools();
}

showDevelopertools()
.then(() => console.log('Showing dev tools')
.catch(err => console.error(err));
```
