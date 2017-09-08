Re-enables user changes to a window's size/position when using the window's frame
# Example
```js
async function enableFrame() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.enableFrame();
}

enableFrame().then(() => console.log('Application window is enabled')).catch(err => console.log(err));
```
