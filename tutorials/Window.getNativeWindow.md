Returns the native JavaScript "window" object for the window.
### Example
```js
async function getNativeWindow() {
    const win = await fin.Window.create({
        uuid: 'OpenfinPOC',
        name: 'childWin',
        url: 'about:blank',
        autoShow: true
    });
    return await win.getNativeWindow();
}

getNativeWindow().then(_win => console.log(_win)).catch(err => console.log(err));
```
