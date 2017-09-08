Flashes the window’s frame and taskbar icon until stopFlashing is called
# Example
```js
async function windowFlash() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.flash();
}

windowFlash().then(() => console.log('Application window flashing')).catch(err => console.log(err));
```
