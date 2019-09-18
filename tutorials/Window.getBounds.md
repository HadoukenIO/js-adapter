Gets the current bounds (top, bottom, right, left, width, height) of the window.

Returned object will have the following shape:
```ts
{
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
```

# Example
```js
async function getBounds() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getBounds.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.getBounds();
}

getBounds().then(bounds => console.log(bounds)).catch(err => console.log(err));
```
