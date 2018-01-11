Returns a frame info object for the represented frame
# Example
```js
async function getInfo() {
    const frm = await fin.Frame.getCurrent();
    return await frm.getInfo();
}
getInfo().then(info => console.log(info)).catch(err => console.log(err));
```
