Restarts the application.
# Example

```js
async function restartApplication() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.restart();
}

restartApplication().then(() => console.log('Restarting Application')).catch(err => console.error(err));
```