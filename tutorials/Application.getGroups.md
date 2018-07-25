Retrieves an array of active window groups for all of the application's windows. Each group is represented as an array of wrapped fin.Windows.
# Example
```js
async function getGroups() {
    const app = await fin.Application.getCurrent();
    return await app.getGroups();
}

getGroups().then(groups => console.log(groups)).catch(err => console.log(err));
```
