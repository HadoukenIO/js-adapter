Returns a frame info object for the represented frame
# Example
```js
async function getParentWindow() {
    const frm = await fin.Frame.getCurrent();
    return await frm.getParentWindow();
}
getParentWindow().then(winInfo => console.log(winInfo)).catch(err => console.log(err));
```
