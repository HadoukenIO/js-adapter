Sets the zoom level of the window

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.setZoomLevel.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function setZoomLevel(number) {
    const app = await createWin();
    return await app.setZoomLevel(number);
}

setZoomLevel(4).then(() => console.log('Setting a  zoom level')).catch(err => console.log(err));
```
