Creates a new Window.

# Example
```js
async function createWindow() {
    const winOption = {
        name:'child',
        defaultWidth: 300,
        defaultHeight: 300,
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.create.html',
        frame: true,
        autoShow: true
    };
    return await fin.Window.create(winOption);
}

createWindow().then(() => console.log('Window is created')).catch(err => console.log(err));
```
