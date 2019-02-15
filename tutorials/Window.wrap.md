Asynchronously returns a Window object that represents an existing window.
# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.wrap.html',
        autoShow: true
    });
    return await app.getWindow();
}
createWin().then(() => fin.Window.wrap({ uuid: 'app-1', name: 'myApp' }))
.then(win => console.log('wrapped window'))
.catch(err => console.log(err));
```
