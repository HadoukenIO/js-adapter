Creates a new Application.
# Example
```js
async function createApp() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Application.create.html',
        autoShow: true
    });
    await app.run();
}

createApp().then(() => console.log('Application is created')).catch(err => console.log(err));
```
