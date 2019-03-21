Instructs the RVM to schedule one restart of the application once upon a complete shutdown.
# Example
```js
async function scheduleRestart() {
    const app = await fin.Application.getCurrent();
    return await app.scheduleRestart();
}

scheduleRestart().then(() => console.log('Application is scheduled to restart')).catch(err => console.log(err));
```
