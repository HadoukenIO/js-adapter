Shows the BrowserView on a window.
# Example
```js
let browserView;
async function createBrowserView() {
    const me = await fin.Window.getCurrent();
    return fin.BrowserView.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameHide', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function hideBrowserView() {
    await createBrowserView();
    console.log('BrowserView created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.BrowserView.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameHide' });
    await browserView.hide();
}

hideBrowserView()
    .then(() => console.log('BrowserView hidden.'))
    .catch(err => console.log(err));
```
