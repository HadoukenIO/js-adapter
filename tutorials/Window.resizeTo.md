Resizes the window to the specified dimensions

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

async function resizeTo(left, top, anchor) {
    const app = await createWin();
    return await app.resizeTo(left, top, );
}

resizeTo(580, 300, "top-left").then(() => console.log('Resized')).catch(err => console.log(err));
```
