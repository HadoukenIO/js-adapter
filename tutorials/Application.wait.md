Waits for a hanging application. This method can be called in response to an application "not-responding" to allow the application to continue and to generate another "not-responding" message after a certain period of time.
# Example

```js
async function wait() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.wait();
}

wait().then(() => console.log('Waiting for a hanging application')).catch(err => console.error(err));
```