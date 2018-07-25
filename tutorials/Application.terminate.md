Closes the application by terminating its process.
# Example
```js
async function terminateApp() {
    const app = await fin.Application.getCurrent();
    return await app.terminate();
}
terminateApp().then(() => console.log('Application terminated')).catch(err => console.log(err));
```
