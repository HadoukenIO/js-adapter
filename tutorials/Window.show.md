Shows the window if it is hidden at the specified location

# Example
```js
async function show() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.show();
}

show().then(() => console.log('Showing')).catch(err => console.log(err));
```