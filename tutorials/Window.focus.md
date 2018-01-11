Gives focus to the window

# Example
```js
async function focusWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.focus();
}

focusWindow().then(() => console.log('Window focused')).catch(err => console.log(err));
```
