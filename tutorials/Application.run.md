Runs the application. When the application is created, run must be called.
# Example 

```js
async function run() {
    const app = await fin.Application.create({
        uuid: 'app-1',
        name: 'myApp',
        url: 'https://openfin.co',
        autoShow: true
    });
    return await app.run();
}

run().then(() => console.log('Application is running')).catch(err => console.error(err));
```