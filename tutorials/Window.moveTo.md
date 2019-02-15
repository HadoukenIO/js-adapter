Moves the window to a specified location

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.moveTo.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function moveTo(left, top) {
    const app = await createWin();
    return await app.moveTo(left, top)
}

moveTo(580, 300).then(() => console.log('Moved')).catch(err => console.log(err))
```
