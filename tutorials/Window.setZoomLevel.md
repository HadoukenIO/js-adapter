Sets the zoom level of the window

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function setZoomLevel(number) {
    const app = await createWin();
    return await app.setZoomLevel(number);
}

setZoomLevel(220).then(() => console.log('Setting a  zoom level')).catch(err => console.log(err));
```
