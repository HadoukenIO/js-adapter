Returns an instance of the currently running application.
# Example
```js
async function getCurrent() {
    const app = await fin.Application.create({
        uuid: 'app-1',
        name: 'myApp',
        url: 'https://openfin.co',
        autoShow: true
    });

    await app.run();
    await app.getCurrent();
    return app.restart();
}

getCurrent().then(() => console.log('Restarting Application')).catch(err => console.error(err))
```