Shows the window if it is hidden at the specified location

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.show.html',
        autoShow: false
    });
    return await app.getWindow();
}

async function show() {
    const win = await createWin();
    return await win.show()
}

show().then(() => console.log('Showing')).catch(err => console.log(err));
```
