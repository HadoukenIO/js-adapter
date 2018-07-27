Retrieves information about the application.
# Example
```js
async function getInfo() {
    const app = await fin.Application.getCurrent();
    return await app.getInfo();
}

getInfo().then(info => console.log(info)).catch(err => console.log(err));
```
