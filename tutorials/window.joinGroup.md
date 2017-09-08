Joins the same window group as the specified window
# Example
```js
async function mainWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function joinGroups() {
    const mainAppwin = await mainWin();
    const app = await fin.Application.create({
        name: 'myApp-1',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await mainAppwin.joinGroup(win);
}

joinGroups().then(() => console.log('Windows connected')).catch(err => console.log(err));
```
