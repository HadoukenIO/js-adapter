Sets the window's size and position

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.setBounds.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function setBounds(bounds) {
    const app = await createWin();
    return await app.setBounds();
}

setBounds({
    height: 100,
    width: 200,
    top: 400,
    left: 400
}).then(() => console.log('Bounds set to window')).catch(err => console.log(err));
```
