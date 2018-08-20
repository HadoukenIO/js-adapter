Returns a unique identifier (UUID) for the machine (SHA256 hash of the system's MAC address).
This call will return the same value on subsequent calls on the same machine(host).
The values will be different on different machines, and should be considered globally unique.

# Example
```js
fin.System.getDeviceId().then(id => console.log(id)).catch(err => console.log(err));
```
