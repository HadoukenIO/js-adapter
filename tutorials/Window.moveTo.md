Moves the window to a specified location

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
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.moveTo.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function moveTo(left, top) {
    const win = await createWin();
    const options = {
        moveIndependently: false
    }
    return await win.moveTo(left, top, options)
}

moveTo(580, 300).then(() => console.log('Moved')).catch(err => console.log(err))
```
