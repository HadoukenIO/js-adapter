Synchronously returns a BrowserView object that represents an existing application.
# Example
```js
const browserView = fin.BrowserView.wrapSync({ uuid: 'testBrowserView', name: 'testBrowserViewName' });
await browserView.hide();
```
