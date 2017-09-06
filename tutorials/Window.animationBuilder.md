Closes the window
# Example
```js
async function animationBuilder() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.animationBuilder();
}

animationBuilder().then(() => true).catch(err => console.log(err));
```
