Removes all listeners, or those of the specified event type.

### Example

```js
const externalApp = fin.ExternalApplication.wrapSync('my-uuid');
externalApp.removeAllListeners("connected");
```
