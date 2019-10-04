Shows the View on a window.
# Example
```js
let browserView;
async function createView() {
    const me = await fin.Window.getCurrent();
    return fin.View.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameHide', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function hideView() {
    await createView();
    console.log('View created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.View.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameHide' });
    await browserView.hide();
}

hideView()
    .then(() => console.log('View hidden.'))
    .catch(err => console.log(err));
```
