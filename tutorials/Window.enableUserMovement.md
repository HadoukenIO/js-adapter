Re-enables user changes to a window's size/position when using the window's frame
# Example
```js
async function enableUserMovement() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.enableFrame.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.enableUserMovement();
}

enableUserMovement().then(() => console.log('Window is enabled')).catch(err => console.log(err));
```
