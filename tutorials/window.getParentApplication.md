Gets the parent application

# Example
```js
async function getParentApplication() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getBounds();
}

getParentApplication().then(parentApplication => console.log(parentApplication)).catch(err => console.log(err));
```
