Restarts the application.
# Example
```js
async function restartApp() {
    const app = await fin.Application.getCurrent();
    return await app.restart();
}
restartApp().then(() => console.log('Application restarted')).catch(err => console.log(err));
```
