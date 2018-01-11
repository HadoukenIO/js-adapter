Retrieves information about a given application connected to the bus.

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
    const extApp = await fin.ExternalApplication.wrap('javaApp-uuid');
    return await extApp.getInfo();
}
getInfo().then(info => console.log(info)).catch(err => console.log(err));
```
