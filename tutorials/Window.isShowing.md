Determines if the window is currently showing.

# Example
```js
async function isWindowShowing() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.isShowing.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.isShowing();
}

isWindowShowing().then(bool => console.log(bool)).catch(err => console.log(err));
```
