Hides the window

# Example
```js
async function hideWindow() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.hide.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.hide();
}

hideWindow().then(() => console.log('Window is hidden')).catch(err => console.log(err));
```
