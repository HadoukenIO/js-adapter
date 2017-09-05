```js
async function getMonitorInfo() {
    return await fin.System.getMonitorInfo();
}

getMonitorInfo().then(monitorInfo => console.log(monitorInfo)).catch(err => console.log(err));
```
