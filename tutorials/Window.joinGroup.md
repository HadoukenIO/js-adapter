Joins the same window group as the specified window
# Example
```js
async function createWin(uuid) {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: uuid,
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.joinGroup.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function joinGroups() {
    const mainWin = await createWin('app-1');
    const appWin = await createWin('app-2');
    return await mainWin.joinGroup(appWin);
}

joinGroups().then(() => console.log('Windows are connected')).catch(err => console.log(err));
```
