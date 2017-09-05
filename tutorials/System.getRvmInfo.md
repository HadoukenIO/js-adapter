Returns information about the running RVM in an object
# Example
```js
async function getRvmInfo() {
    return await fin.System.getRvmInfo();
}

getRvmInfo().then(RvmInfo => console.log(RvmInfo)).catch(err => console.log(err));
```
