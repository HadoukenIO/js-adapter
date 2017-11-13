Closes the application by terminating its process.
# Example

```js
async function terminate() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.terminate();
}

terminate().then(() => console.log('Terminating Application')).catch(err => console.error(err));
```