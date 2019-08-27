Monitors a running process. If an unused uuid is provided in options, it will be used. If no uuid is provided, OpefinFin will assign a uuid.
# Example
```js
fin.System.monitorExternalProcess({
    pid: 10208,
    uuid: 'my-external-process', // optional
    listener: function (result) {
        console.log('the exit code', result.exitCode);
    }
}).then(processIdentity => console.log(processIdentity)).catch(err => console.log(err));
```
