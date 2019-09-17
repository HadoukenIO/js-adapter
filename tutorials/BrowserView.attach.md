Attaches a BrowserView to a window.
# Example
```js
let browserView;
async function createBrowserView() {
    const me = await fin.Window.getCurrent();
    return fin.BrowserView.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameAttach', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

async function attachBrowserView() {
    await createBrowserView();
    console.log('BrowserView created.');
    const me = await fin.Window.getCurrent();
    browserView = fin.BrowserView.wrapSync({ uuid: me.identity.uuid, name: 'browserViewNameAttach' });
    const winOption = {
        name:'winOptionName',
        defaultWidth: 300,
        defaultHeight: 300,
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.create.html',
        frame: true,
        autoShow: true
    };
    const newWindow = await fin.Window.create(winOption);
    browserView.attach(newWindow.identity);
}

attachBrowserView()
    .then(() => console.log('BrowserView attached to new window.'))
    .catch(err => console.log(err));
```
