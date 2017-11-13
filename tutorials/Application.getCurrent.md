Returns an instance of the currently running application.
# Example

```js
async function getCurrent_and_Close() {
    const app = await fin.Application.getCurrent();
    return await app.close();
}

getCurrent_and_Close().then(() => console.log('Closing application')).catch(err => console.error(err));
```