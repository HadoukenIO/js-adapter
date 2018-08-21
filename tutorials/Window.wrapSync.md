Synchronously returns a Window object that represents an existing window.
# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}
await createWin();
let win = fin.Window.wrapSync({ uuid: 'app-1', name: 'myApp' });
```
