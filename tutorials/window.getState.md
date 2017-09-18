Gets the current state ("minimized", "maximized", or "restored") of the window
# Example
```js
async function getWindowState() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getState();
}

getWindowState().then(winState => console.log(winState)).catch(err => console.log(err));
```
