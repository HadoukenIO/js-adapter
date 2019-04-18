Retrieves an array of all the processes that are currently running across all runtimes (not including ones in a foreign security realm context).
<br>Each process has a type (browser, tab or GPU), identifying information (uuid and name of the corresponding parent application) and diagnostic process information.
<br>Note: chrome debugger tool fires up it's own tab process.
# Example
```js
fin.System.getProcessList().then(ProcessList => console.log(ProcessList)).catch(err => console.log(err));
```
