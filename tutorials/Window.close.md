Closes the window
# Example
```js
async function closeWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.close();
}

closeWindow().then(() => console.log('window closed')).catch(err => console.log(err));
```
