Retrieves the contents of the log with the specified filename
# Example
```js
async function getLogList() {
    return await fin.System.getLogList();
}

getLogList().then(logList => console.log(logList)).catch(err => console.log(err));

async function getLog() {
    const logs = await getLogList();
    return await fin.System.getLog(logs[0]);
}

getLog().then(log => console.log(log)).catch(err => console.log(err));

```
