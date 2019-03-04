Moves the window by a specified amount

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.moveBy.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function moveBy(left, top) {
    const win = await createWin();
    return await win.moveBy(left, top);
}

moveBy(580, 300).then(() => console.log('Moved')).catch(err => console.log(err));
```
