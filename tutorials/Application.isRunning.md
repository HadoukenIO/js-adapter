Determines if the application is currently running.
# Example
```js
async function isAppRunning() {
    const app = await fin.Application.getCurrent();
    return await app.isRunning();
}
isAppRunning().then(running => console.log(`Current app is running: ${running}`)).catch(err => console.log(err));
```
