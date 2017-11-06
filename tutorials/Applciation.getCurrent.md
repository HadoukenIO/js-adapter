Returns an instance of the currently running application.
# Example
```js
async function getCurrent_and_Restart() {
    const app = await fin.Application.getCurrent()
    return await app.restart();
}
getCurrent_and_Restart().then(() => console.log('Restarting Application')).catch(err => console.error(err))
```