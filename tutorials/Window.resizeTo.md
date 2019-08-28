Resizes the window to the specified dimensions

### Options Object

```js
{
    moveIndependently: true // Move a window indpendently of its group or along with its group. Defaults to false.
}
```

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.resizeTo.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function resizeTo(left, top, anchor) {
    const win = await createWin();
    const options = {
        moveIndependently: false
    }
    return await win.resizeTo(left, top, anchor, options);
}

resizeTo(580, 300, 'top-left').then(() => console.log('Resized')).catch(err => console.log(err));
```
