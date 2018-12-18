Runs the application. When the application is created, run must be called.
# Example
```js
async function run() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
}
run().then(() => console.log('Application is running')).catch(err => console.log(err));
```
