Retrieves an array of data (name, ids, bounds) for all application windows.
# Example
```js
fin.System.getAllExternalApplications()
.then(externalApps => console.log('Total external apps: ' + externalApps.length))
.catch(err => console.log(err));
```
