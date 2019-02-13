Sets a username that correlates the application's log with the application log manager.

### Example
```js
async function setAppLogUser() {
    const app = await fin.Application.getCurrent();
    return await app.setAppLogUsername('username');
}

setAppLogUser().then(() => console.log('Success')).catch(err => console.log(err));

```
