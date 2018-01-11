Retrieves information about the system tray.
# Example
```js
async function getTrayIconInfo() {
    const app = await fin.Application.wrap({ uuid: 'testapp' });
    return await app.getTrayIconInfo();
}
getTrayIconInfo().then(info => console.log(info)).catch(err => console.log(err));
```
