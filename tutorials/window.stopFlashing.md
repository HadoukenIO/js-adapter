Stops the taskbar icon from flashing

# Example
```js
async function stopWindowFlashing() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.stopFlashing();
}

stopWindowFlashing().then(() => console.log('Application window flashing')).catch(err => console.log(err));
```
