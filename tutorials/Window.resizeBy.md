Resizes the window by a specified amount

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.resizeBy.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function resizeBy(left, top, anchor) {
    const app = await createWin();
    return await app.resizeBy(left, top, anchor)
}

resizeBy(580, 300, 'top-right').then(() => console.log('Resized')).catch(err => console.log(err));
```
