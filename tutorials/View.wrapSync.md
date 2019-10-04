Synchronously returns a View object that represents an existing application.
# Example
```js
const browserView = fin.View.wrapSync({ uuid: 'testView', name: 'testViewName' });
await browserView.hide();
```
