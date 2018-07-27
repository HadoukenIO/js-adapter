Returns an Application object that represents the current application

# Example
```js
async function isCurrentAppRunning () {
    const app = await fin.Application.getCurrent();
    return app.isRunning();
}

isCurrentAppRunning().then(running => {
    console.log(`Current app is running: ${running}`);
}).catch(err => {
    console.error(err);
});

```
