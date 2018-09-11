Synchronously returns an Application object that represents the current application

# Example
```js
async function isCurrentAppRunning () {
    const app = fin.Application.getCurrentSync();
    return app.isRunning();
}

isCurrentAppRunning().then(running => {
    console.log(`Current app is running: ${running}`);
}).catch(err => {
    console.error(err);
});

```
