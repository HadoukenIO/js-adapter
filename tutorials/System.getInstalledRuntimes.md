Returns an array of version numbers of the runtimes installed. Requires RVM 5.2+
# Example
```js
fin.System.getInstalledRuntimes().then(response => console.log(response.runtimes)).catch(err => console.log(err));
```