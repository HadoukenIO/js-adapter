Closes the window
# Example
```js
async function closeWindow() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.close.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.close();
}

closeWindow().then(() => console.log('Window closed')).catch(err => console.log(err));
```
