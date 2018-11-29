Monitors a running process.
# Example
```js
fin.System.monitorExternalProcess({
    pid: 10208,
    listener: function (result) {
        console.log('the exit code', result.exitCode);
    }
}).then(processIdentity => console.log(processIdentity)).catch(err => console.log(err));
```
