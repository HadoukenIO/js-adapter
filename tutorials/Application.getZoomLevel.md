Returns the current zoom level of the application

# Example
```js
async function getZoomLevel() {
    const app = await fin.Application.getCurrent();
    return await app.getZoomLevel();
}

getZoomLevel().then(zoomLevel => console.log(zoomLevel)).catch(err => console.log(err));
```
