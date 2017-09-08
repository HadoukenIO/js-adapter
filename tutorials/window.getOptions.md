Gets the current settings of the window
# Example
```js
async function getWindowOptions() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getOptions();
}

getWindowOptions().then(opts => console.log(opts)).catch(err => console.log(err));
```
