Determines if the application is currently running.
# Example

```js
async function isRunning() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.isRunning();
}

isRunning().then(running => {
    console.log(running ? 'Application is running' : 'Application is not running')
}).catch(err => console.error(err));
```