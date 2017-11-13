Instructs the RVM to schedule one restart of the application.
# Example

```js
async function scheduleRestart() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.scheduleRestart();
}

scheduleRestart().then(() => console.log('Application is scheduled for restart.')).catch(err => console.error(err));
```