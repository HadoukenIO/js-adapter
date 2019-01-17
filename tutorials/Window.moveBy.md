Moves the window by a specified amount

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.moveBy.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function moveBy(left, top) {
    const app = await createWin();
    return await app.moveBy(left, top);
}

moveBy(580, 300).then(() => console.log('Moved')).catch(err => console.log(err));
```
