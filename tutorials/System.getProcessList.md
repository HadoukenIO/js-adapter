Retrieves an array of all of the runtime processes that are currently running
# Example
```js
async function getProcessList() {
    return await fin.System.getProcessList();
}

getProcessList().then(ProcessList => console.log(ProcessList)).catch(err => console.log(err));
```
