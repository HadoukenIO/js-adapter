Shows the View on a window.
# Example
```js
let browserView;
async function createView() {
    const me = await fin.Window.getCurrent();
    return fin.View.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameGetInfo', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function getViewInfo() {
    await createView();
    console.log('View created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.View.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameGetInfo' });
    return browserView.getInfo();
}

getViewInfo()
    .then((info) => console.log('View info fetched.', info))
    .catch(err => console.log(err));
```
