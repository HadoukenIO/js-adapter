Retrieves an array of data for all applications.
### Example
```js
async function getAllApplications(message) {
    return await fin.System.getAllApplications();
}

getAllApplications()
.then(resp => console.log(resp));
.catch(err => console.log(err));
```
