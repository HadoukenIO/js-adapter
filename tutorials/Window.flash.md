Flashes the window’s frame and taskbar icon until the window is activated.
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

windowFlash().then(() => console.log('Window flashing')).catch(err => console.log(err));
```
