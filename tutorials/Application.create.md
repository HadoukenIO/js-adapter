Creates a new Application.
# Example
```js
async function createApp() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
}

createApp().then(() => console.log('Application is created')).catch(err => console.log(err));
```
