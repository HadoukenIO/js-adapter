Attempt to close an external process. The process will be terminated if it has not closed after the elapsed timeout in milliseconds.
# Example

```js
async function terminateExternalProcess() {
    const { uuid } = await fin.System.launchExternalProcess({
        path: "chrome",
        arguments: "https://openfin.co",
        listener: function (result) {
            console.log('the exit code', result.exitCode);
        }
    });
    return await fin.System.terminateExternalProcess({
        uuid,
        timeout: 2,
        killTree: true
    });
}

terminateExternalProcess().then(result => console.log('Terminated external process.')).catch(err => console.error(err));
```