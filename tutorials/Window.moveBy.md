Moves the window by a specified amount

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

async function moveBy(left, top) {
    const app = await createWin();
    return await app.moveBy(left, top);
}

moveBy(580, 300).then(() => console.log('Moved')).catch(err => console.log(err));
```
