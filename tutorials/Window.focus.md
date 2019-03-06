Gives focus to the window

# Example
```js
async function focusWindow() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.focus.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.focus();
}

focusWindow().then(() => console.log('Window focused')).catch(err => console.log(err));
```
