Removes focus from the window
# Example
```js
async function blurWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.blur();
}

blurWindow().then(() => console.log('Blured Window')).catch(err => console.log(err));
```
