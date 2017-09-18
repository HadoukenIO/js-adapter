Retrieves an array containing wrapped fin.Windows that are grouped with this window
# Example
```js
async function getGroup() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getGroup();
}

getGroup().then(group => console.log(group)).catch(err => console.log(err));
```
