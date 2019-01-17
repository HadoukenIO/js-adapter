Maximizes the window

# Example
```js
async function maxWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.maximize.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.maximize();
}

maxWindow().then(() => console.log('Maximized window')).catch(err => console.log(err));
```
