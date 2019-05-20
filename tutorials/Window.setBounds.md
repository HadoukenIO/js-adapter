Sets the window's size and position

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
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.setBounds.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function setBounds(bounds) {
    const win = await createWin();
    const options = {
        moveIndependently: false
    }
    return await win.setBounds(bounds, options);
}

setBounds({
    height: 100,
    width: 200,
    top: 400,
    left: 400
}).then(() => console.log('Bounds set to window')).catch(err => console.log(err));
```
