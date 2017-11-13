Removes the process entry for the passed UUID obtained from a prior call of fin.desktop.System.launchExternalProcess().
# Example

```js
async function releaseExternalProcess() {
    const { uuid } = await fin.System.launchExternalProcess({
        path: "chrome",
        arguments: "https://openfin.co",
        listener: function (result) {
            console.log('the exit code', result.exitCode);
        }
    });
    return await fin.System.releaseExternalProcess(uuid);
}

releaseExternalProcess().then(() => console.log('Released external process.')).catch(err => console.error(err));
```