Gets an information object for the window.

# Example
```js
async function getInfo() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getInfo.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getInfo();
}

getInfo().then(info => console.log(info)).catch(err => console.log(err));
```
