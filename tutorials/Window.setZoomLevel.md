Sets the zoom level of the window
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.setZoomLevel.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function setZoomLevel(number) {
    const win = await createWin();
    return await win.setZoomLevel(number);
}

setZoomLevel(4).then(() => console.log('Setting a  zoom level')).catch(err => console.log(err));
```
