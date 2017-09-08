Prevents a user from changing a window's size/position when using the window's frame
# Example
```js
async function disableFrame() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.disableFrame();
}

disableFrame().then(() => console.log('Application window is disabled')).catch(err => console.log(err));
```
