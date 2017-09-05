Clears all cached data when OpenFin Runtime exits
# Example
```js
async function deleteCacheOnExit() {
    return await fin.System.deleteCacheOnExit();
}

deleteCacheOnExit().then(() => console.log('deleted Cache')).catch(err => console.log(err));
```
