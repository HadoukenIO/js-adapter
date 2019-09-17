Shows the BrowserView on a window.
# Example
```js
let browserView;
async function createBrowserView() {
    const me = await fin.Window.getCurrent();
    return fin.BrowserView.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameGetInfo', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function getBrowserViewInfo() {
    await createBrowserView();
    console.log('BrowserView created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.BrowserView.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameGetInfo' });
    return browserView.getInfo();
}

getBrowserViewInfo()
    .then((info) => console.log('BrowserView info fetched.', info))
    .catch(err => console.log(err));
```
