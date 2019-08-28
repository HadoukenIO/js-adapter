Gets an information object for the window.

#### Response
```js
{
    "canNavigateBack":false,
    "canNavigateForward":false,
    "preloadScripts":[],
    "title":"JSDoc: Tutorial: Window.getInfo",
    "url":"https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getInfo.html"
}
```

# Example
```js
async function getInfo() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getInfo.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.getInfo();
}

getInfo().then(info => console.log(info)).catch(err => console.log(err));
```
