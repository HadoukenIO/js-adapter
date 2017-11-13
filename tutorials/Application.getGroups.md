Retrieves an array of active window groups for all of the application's windows. Each group is represented as an array of wrapped fin.desktop.Windows.
# Example

```js
async function getGroups() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.getGroups();
}

getGroups().then(groups => console.log(groups)).catch(err => console.error(err));
```