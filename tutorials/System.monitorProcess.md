Monitors a running process.
# Example

```js
fin.System.monitorExternalProcess('<paste currently running pid here>').then(payload => console.log(payload)).catch(err => console.error(err));
```