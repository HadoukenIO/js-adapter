Gets the value of a given environment variable on the computer on which the runtime is installed
# Example
```js
fin.System.getEnvironmentVariable('HOME').then(env => console.log(env)).catch(err => console.log(err));
```
