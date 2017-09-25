Gets a base64 encoded PNG snapshot of the window

# Example
```js
async function takeWindowSnapShot() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getSnapshot();
}

takeWindowSnapShot().then(snapShot => console.log(snapShot)).catch(err => console.log(err));
```
