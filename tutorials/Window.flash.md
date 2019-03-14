Flashes the window’s frame and taskbar icon until the window is activated. **NOTE:** On macOS _flash_ only works on inactive windows.

# Example
```js
async function windowFlash() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.flash.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.flash();
}

windowFlash().then(() => console.log('Window flashing')).catch(err => console.log(err));
```
