Shows the window if it is hidden at the specified location

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.showAt.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function showAt(left, top) {
    const app = await createWin();
    return await app.showAt(left, top)
}

showAt(580, 300).then(() => console.log('Showing at')).catch(err => console.log(err));
```
