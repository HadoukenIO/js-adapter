Creates a new BrowserView.
# Example
```js
async function createBrowserView() {
    const me = await fin.Window.getCurrent();
    return fin.BrowserView.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameCreate', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

createBrowserView().then(() => console.log('BrowserView created.')).catch(err => console.log(err));
```
