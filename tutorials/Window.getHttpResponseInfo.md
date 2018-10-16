eturns http response info when creating a child window.
### Example
```js
async function getHttpResponseInfo() {
    const win = await fin.Window.create({
        uuid: 'OpenfinPOC',
        name: 'childWin',
        url: 'https://example.com',
        autoShow: true
    });
    return await win.getHttpResponseInfo();
}

getHttpResponseInfo().then(info => console.log(info)).catch(err => console.log(err));
```
