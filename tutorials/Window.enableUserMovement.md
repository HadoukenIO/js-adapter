Re-enables user changes to a window's size/position when using the window's frame
# Example
```js
async function enableUserMovement() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.enableFrame.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.enableUserMovement();
}

enableUserMovement().then(() => console.log('Window is enabled')).catch(err => console.log(err));
```
