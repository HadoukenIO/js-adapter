Retrieves the command line argument string that started OpenFin Runtime
# Example
```js
async function getCommandLineArguments() {
    return await fin.System.getCommandLineArguments();
}

getCommandLineArguments().then(args => console.log(args)).catch(err => console.log(err));

```
