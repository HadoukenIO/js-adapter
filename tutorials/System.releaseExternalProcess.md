Removes the process entry for the passed UUID obtained from a prior call of fin.System.launchExternalProcess().
# Example
```js
fin.System.launchExternalProcess({
    path: "notepad",
    listener: function (result) {
        console.log("The exit code", result.exitCode);
    }
})
.then(identity => fin.System.releaseExternalProcess(identity.uuid))
.then(() => console.log('Process has been unmapped!'))
.catch(err => console.log(err));
```
