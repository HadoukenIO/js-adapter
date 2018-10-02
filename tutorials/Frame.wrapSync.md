Synchronously returns a reference to the specified frame. The frame does not have to exist.
# Example
```js
const frm = fin.Frame.wrapSync({ uuid: 'testFrame', name: 'testFrame' });
const info = await frm.getInfo();
console.log(info);
```
