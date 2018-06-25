Creates a new Window.
# Example
```js
async function createWindow() {
    const winOption = {
        name:'child',
        defaultWidth: 300,
        defaultHeight: 300,
        url: 'http://www.google.com',
        frame: true,
        autoShow: true
    };
    return await fin.Window.create(winOption);
}

createWindow().then(() => console.log('Window is created')).catch(err => console.log(err));
```
