Determines if the window is currently showing.

# Example
```js
async function getBounds() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getBounds();
}

isWindowShowing().then(bool => console.log(bool)).catch(err => console.log(err));
```
