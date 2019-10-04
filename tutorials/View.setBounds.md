Shows the View on a window.
# Example
```js
let browserView;
async function createView() {
    const me = await fin.Window.getCurrent();
    return fin.View.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameSetBounds', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function setViewBounds() {
    await createView();
    console.log('View created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.View.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameSetBounds' });
    await browserView.setBounds({
        x: 100,
        y: 100,
        width: 300,
        height: 300
    });
}

setViewBounds()
    .then(() => console.log('View set to new bounds.'))
    .catch(err => console.log(err));
```
