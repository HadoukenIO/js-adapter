Instructs the RVM to schedule one restart of the application.
# Example
```js
async function scheduleRestart() {
    const app = await fin.Application.getCurrent();
    return await app.scheduleRestart();
}

scheduleRestart().then(() => console.log('Application is schedule to restart')).catch(err => console.log(err));
```
