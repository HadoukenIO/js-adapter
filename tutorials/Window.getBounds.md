Gets the current bounds (top, left, width, height) of the window

# Example
```js
async function getBounds() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getBounds();
}

getBounds().then(bounds => console.log(bounds)).catch(err => console.log(err));
```
