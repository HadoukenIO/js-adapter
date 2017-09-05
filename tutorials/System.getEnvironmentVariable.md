Gets the value of a given environment variable on the computer on which the runtime is installed
# Example
```js
async function getEnvironmentVariable(envVariableName) {
    return await fin.System.getEnvironmentVariable(envVariableName);
}

getEnvironmentVariable('HOME').then(env => console.log(env)).catch(err => console.log(err));
```
