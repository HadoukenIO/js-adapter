Synchronously returns a Window object that represents an existing window.
# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.wrapSync.html',
        autoShow: true
    });
    return await app.getWindow();
}
await createWin();
let win = fin.Window.wrapSync({ uuid: 'app-1', name: 'myApp' });
```
