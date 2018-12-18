Writes the passed message into both the log file and the console.
# Example
```js
fin.System.log("info", "An example log message").then(() => console.log('Log info message')).catch(err => console.log(err));
```
