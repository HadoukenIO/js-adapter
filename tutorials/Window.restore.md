Restores the window to its normal state (i.e., unminimized, unmaximized

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

async function restore() {
    const app = await createWin();
    return await app.restore();
}

restore().then(() => console.log('Restored')).catch(err => console.log(err));
```
