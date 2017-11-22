Retrieves information about the application.

#### response
```
{
    parent: {
        uuid: 'parent-uuid',
        name: 'parent-name'
    }
}
```

### Example

```js
async function getInfo() {
    const extApp = await fin.ExternalApplication.wrap('notepad-uuid');
    return await extApp.getInfo();
}
getInfo().then((info) => console.log(info)).catch(err => console.log(err));
```
