Determines if the window is currently showing.

# Example
```js
async function isWindowShowing() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.isShowing.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.isShowing();
}

isWindowShowing().then(bool => console.log(bool)).catch(err => console.log(err));
```
