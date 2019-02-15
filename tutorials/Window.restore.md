Restores the window to its normal state (i.e., unminimized, unmaximized

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.restore.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function restore() {
    const app = await createWin();
    return await app.restore();
}

restore().then(() => console.log('Restored')).catch(err => console.log(err));
```
