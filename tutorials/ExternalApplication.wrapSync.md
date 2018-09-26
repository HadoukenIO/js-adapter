Synchronously returns an External Application object that represents an existing external application.
# Example
```js
const extApp = fin.ExternalApplication.wrapSync('javaApp-uuid');
const info = await extApp.getInfo();
console.log(info);
```
