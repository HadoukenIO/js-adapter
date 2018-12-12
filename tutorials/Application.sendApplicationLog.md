Uploads app log to Log Manager and returns a promise containing the log id.

 ### Example
```js
async function sendLog() {
    const app = await fin.Application.getCurrent();
    return await app.sendApplicationLog();
}
 sendLog().then(info => console.log(info)).catch(err => console.log(err));
```