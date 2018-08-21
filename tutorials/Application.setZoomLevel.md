Sets the zoom level of the application. The original size is 0 and each increment above or below represents zooming 20% larger or smaller to default limits of 300% and 50% of original size, respectively.

# Example
```js
async function setZoomLevel(number) {
    const app = await fin.Application.getCurrent();
    return await app.setZoomLevel(number);
}

setZoomLevel(5).then(() => console.log('Setting a  zoom level')).catch(err => console.log(err));
```
