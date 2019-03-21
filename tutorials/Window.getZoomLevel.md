Returns the zoom level of the window

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getZoomLevel.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function getZoomLevel() {
    const win = await createWin();
    return await win.getZoomLevel();
}

getZoomLevel().then(zoomLevel => console.log(zoomLevel)).catch(err => console.log(err));
```
