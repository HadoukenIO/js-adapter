Closes the window
# Example
```js
async function getWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

getWindow().close().then(() => console.log('window closed')).catch(err => console.log(err));
```
