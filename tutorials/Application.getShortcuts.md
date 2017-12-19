Retrieves current application's shortcut configuration.
# Example
```js
async function getShortcuts() {
    const app = await fin.Application.wrap({ uuid: 'testapp' });
    return await app.getShortcuts();
}
getShortcuts().then(config => console.log(config)).catch(err => console.log(err));
```
