Resizes the window by a specified amount

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
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.resizeBy.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function resizeBy(left, top, anchor) {
    const win = await createWin();
    const options = {
        moveIndependently: false
    }
    return await win.resizeBy(left, top, anchor, options)
}

resizeBy(580, 300, 'top-right').then(() => console.log('Resized')).catch(err => console.log(err));
```
