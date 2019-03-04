Gets the current state ("minimized", "maximized", or "restored") of the window

# Example
```js
async function getWindowState() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getState.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.getState();
}

getWindowState().then(winState => console.log(winState)).catch(err => console.log(err));
```
