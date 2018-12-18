Removes all listeners, or those of the specified event type.

### Example

```js
const myFrame = fin.Frame.wrapSync({uuid: 'OpenfinPOC', name: '2407fac7-25dc-4bba-9add-cd09b2fc078c'});
myFrame.removeAllListeners("disconnected");
```
