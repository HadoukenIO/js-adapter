Resizes the window by a specified amount

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function resizeBy(left, top, anchor) {
    const app = await createWin();
    return await app.resizeBy(left, top, anchor)
}

resizeBy(580, 300, "top-right").then(() => console.log('Resized')).catch(err => console.log(err));
```
