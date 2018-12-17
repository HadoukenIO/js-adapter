Removes all listeners, or those of the specified event type.

### Example

```js
const application = fin.Application.getCurrentSync();
application.removeAllListeners("closed");
```
