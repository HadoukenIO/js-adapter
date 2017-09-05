Returns a hex encoded hash of the mac address and the currently logged in user name
# Example
```js
async function getDeviceId() {
    return await fin.System.getDeviceId();
}

getDeviceId().then(id => console.log(id)).catch(err => console.log(err));
```
