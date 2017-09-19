Leaves the current window group so that the window can be move independently of those in the group
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
    return await mainAppwin.leaveGroup(win);
}

joinGroups().then(() => console.log('Windows disconnected')).catch(err => console.log(err));
```
