Returns an instance of the current window.
# Example
```js
async function getCurrent() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    await app.getWindow();
    const win = await app.getCurrent();
    return await app.flash();
}

getCurrent().then(() => console.log('Application is flashing')).catch(err => console.error(err))
```