Sends a message to the RVM to upload the application's logs. On success,
an object containing logId is returned.

 ### Example
```js
async function sendLog() {
    const app = await fin.Application.getCurrent();
    return await app.sendApplicationLog();
}

sendLog().then(info => console.log(info.logId)).catch(err => console.log(err));
```
