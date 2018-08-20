Minimizes the window.

# Example
```js
async function minWindow() {
    const win = await fin.Window.getCurrent();
    return await win.minimize();
}

minWindow().then(() => console.log('Minimized window')).catch(err => console.log(err));
```
