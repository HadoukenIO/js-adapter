Synchronously returns a Window object that represents an existing window.
# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.wrapSync.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}
await createWin();
let win = fin.Window.wrapSync({ uuid: 'app-1', name: 'myApp' });
```
