Returns a hex encoded hash of the mac address and the currently logged in user name.
For Windows systems this is a sha256 hash of the mac address and `USERNAME`.
For OSX systems the `USER` environment variable is used.
# Example
```js
fin.System.getDeviceUserId().then(id => console.log(id)).catch(err => console.log(err));
```
