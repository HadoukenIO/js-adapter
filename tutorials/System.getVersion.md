Returns the version of the runtime. The version contains the major, minor, build and revision numbers.
# Example
```js
async function getVersion() {
    return await fin.System.getVersion();
}

getVerison().then(v => console.log(v)).catch(err => console.log(err));
```
