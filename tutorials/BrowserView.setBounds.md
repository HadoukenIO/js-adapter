Shows the BrowserView on a window.
# Example
```js
let browserView;
async function createBrowserView() {
    const me = await fin.Window.getCurrent();
    return fin.BrowserView.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameSetBounds', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function setBrowserViewBounds() {
    await createBrowserView();
    console.log('BrowserView created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.BrowserView.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameSetBounds' });
    await browserView.setBounds({
        x: 100,
        y: 100,
        width: 300,
        height: 300
    });
}

setBrowserViewBounds()
    .then(() => console.log('BrowserView set to new bounds.'))
    .catch(err => console.log(err));
```
