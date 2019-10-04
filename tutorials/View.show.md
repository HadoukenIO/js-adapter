Shows the View on a window.
# Example
```js
let browserView;
async function createView() {
    const me = await fin.Window.getCurrent();
    return fin.View.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameShow', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function hideAndShowView() {
    await createView();
    console.log('View created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.View.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameShow' });
    await browserView.hide();
    console.log("View hidden.");
    browserView.show();
    console.log("View shown.");
}

hideAndShowView()
    .then(() => console.log('View hidden and shown.'))
    .catch(err => console.log(err));
```
