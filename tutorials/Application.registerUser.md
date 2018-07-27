Manually registers a user with the licensing service. The only data sent by this call is userName and appName.
# Example
```js
async function registerUser() {
    const app = await fin.Application.getCurrent();
    return await app.registerUser('user', 'myApp');
}

registerUser().then(() => console.log('Successfully registered the user')).catch(err => console.log(err));
```
