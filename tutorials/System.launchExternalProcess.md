Runs an executable or batch file.
# Example

```js
fin.System.launchExternalProcess({
    path: "chrome",
    arguments: "https://openfin.co",
    listener: function (result) {
        console.log('the exit code', result.exitCode);
    }
}).then(payload => console.log(`External Process uuid: ${ payload.uuid }`)).catch(error => console.log(error));
```