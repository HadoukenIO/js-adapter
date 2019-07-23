Returns an array of version numbers of the runtimes installed.
# Example
```js
fin.System.getInstalledRuntimes().then(response => console.log(response.runtimes)).catch(err => console.log(err));
```