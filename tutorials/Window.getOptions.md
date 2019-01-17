Gets the current settings of the window

# Example
```js
async function getWindowOptions() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getOptions.html',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getOptions();
}

getWindowOptions().then(opts => console.log(opts)).catch(err => console.log(err));
```
