Shows the window if it is hidden at the specified location

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.show.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function show() {
    const app = await createWin();
    return await app.show()
}

show().then(() => console.log('Showing')).catch(err => console.log(err));
```
