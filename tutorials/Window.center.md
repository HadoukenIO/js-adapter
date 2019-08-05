Center a window

# Example
```js
async function centerWindow() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.center.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.center();
}

centerWindow().then(() => console.log('Window centered')).catch(err => console.log(err));
```
