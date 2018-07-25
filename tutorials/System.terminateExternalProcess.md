Attempt to close an external process. The process will be terminated if it has not closed after the elapsed timeout in milliseconds.
# Example
```js
fin.System.launchExternalProcess({
    path: "notepad",
    listener: function (result) {
        console.log("The exit code", result.exitCode);
    }
})
.then(identity => fin.System.terminateExternalProcess({uuid: identity.uuid, timeout:2000, killTree: false}))
.then(() => console.log('Terminate the process'))
.catch(err => console.log(err));
```
