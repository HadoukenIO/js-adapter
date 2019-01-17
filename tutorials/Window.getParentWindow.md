Gets the parent window

# Example
```js
async function getParentWindow() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getParentWindow.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getParentWindow();
}

getParentWindow().then(parentWindow => console.log(parentWindow)).catch(err => console.log(err));
```
