Returns the native OS level Id. In Windows, it will return the Windows [handle](https://docs.microsoft.com/en-us/windows/desktop/WinProg/windows-data-types#HWND).

# Example
```js
async function getWindowNativeId() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getNativeId.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getNativeId();
}

getWindowNativeId().then(nativeId => console.log(nativeId)).catch(err => console.log(err));
```
