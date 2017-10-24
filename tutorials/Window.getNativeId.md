This returns the native OS level Id, in Windows it will return the Windows [handle](https://msdn.microsoft.com/en-us/library/windows/desktop/aa383751(v=vs.85).aspx#HWND)

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
