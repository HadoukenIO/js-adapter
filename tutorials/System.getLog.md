Retrieves the contents of the log with the specified filename
# Example
```js
async function getLog() {
    const logs = await fin.System.getLogList();
    return await fin.System.getLog(logs[0]);
}

getLog().then(log => console.log(log)).catch(err => console.log(err));
```
