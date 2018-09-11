Synchronously returns an Application object that represents an existing application.
# Example
```js
const app = fin.Application.wrapSync({ uuid: 'testapp' });
await app.close();
```
