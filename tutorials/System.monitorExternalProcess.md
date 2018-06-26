Monitors a running process.
# Example
```js
fin.System.monitorExternalProcess({
    pid: 10208
}).then(processIdentity => console.log(processIdentity)).catch(err => console.log(err));
```
