Sets the zoom level of the application

# Example
```js
async function setZoomLevel(number) {
    const app = await fin.Application.getCurrent();
    return await app.setZoomLevel(number);
}

setZoomLevel(5).then(() => console.log('Setting a  zoom level')).catch(err => console.log(err));
```
