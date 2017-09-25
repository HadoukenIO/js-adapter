Moves the window to a specified location

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

async function moveTo(left, top) {
    const app = await createWin();
    return await app.moveTo(left, top)
}

moveTo(580, 300).then(() => console.log('Moved')).catch(err => console.log(err))
```
