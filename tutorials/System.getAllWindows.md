Retrieves an array of data (name, ids, bounds) for all application windows
# Example
```js
async function getAllWindows() {
    return await fin.System.getAllWindows();
}

getAllWindows().then(arr_win => console.log(arr_win)).catch(err => console.log(err));
```
