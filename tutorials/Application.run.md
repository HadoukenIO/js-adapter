# DEPRECATED use Application.start instead
Runs the application. When the application is created, run must be called.
# Example
```js
async function run() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Application.run.html',
        autoShow: true
    });
    await app.run();
}
run().then(() => console.log('Application is running')).catch(err => console.log(err));
```
