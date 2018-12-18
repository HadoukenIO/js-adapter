Runs an executable or batch file.
# Example
```js
fin.System.launchExternalProcess({
    path: "notepad",
    arguments: "",
    listener: function (result) {
        console.log('the exit code', result.exitCode);
    }
}).then(processIdentity => console.log(processIdentity)).catch(err => console.log(err));
```
