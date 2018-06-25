Merges the instance's window group with the same window group as the specified window
# Example
```js
async function createWin(uuid) {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: uuid,
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function mergeGroups() {
    const win1 = await createWin('app-1');
    const win2 = await createWin('app-2');
    const win3 = await createWin('app-3');
    const win4 = await createWin('app-4');
    await win1.joinGroup(win2);
    await win3.joinGroup(win4);
    return await win1.mergeGroups(win3);
}

mergeGroups().then(() => console.log('Groups merged')).catch(err => console.log(err));
```
