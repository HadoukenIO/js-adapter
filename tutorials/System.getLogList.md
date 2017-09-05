Retrieves an array containing information for each log file.
#Example
```js
async function getLogList() {
    return await fin.System.getLogList();
}

getLogList().then(logList => console.log(logList)).catch(err => console.log(err));
```
