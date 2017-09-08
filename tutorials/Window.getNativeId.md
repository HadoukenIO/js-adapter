This returns the native OS level Id, in Windows it will return the Windows hwnd
# Example
```js
async function getWindowNativeId() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getNativeId();
}

getWindowNativeId().then(nativeId => console.log(nativeId)).catch(err => console.log(err));
```
