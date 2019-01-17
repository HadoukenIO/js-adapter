Returns the zoom level of the window

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getZoomLevel.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function getZoomLevel() {
    const app = await createWin();
    return await app.getZoomLevel();
}

getZoomLevel().then(zoomLevel => console.log(zoomLevel)).catch(err => console.log(err));
```
