Hides the window
# Example
```js
async function hideWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.hide();
}

hideWindow().then(() => console.log('Application is hidden')).catch(err => console.log(err));
```
