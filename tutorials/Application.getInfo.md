Retrieves information about the application. message after a certain period of time.
# Example

```js
async function getInfo() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.getInfo();
}

getInfo().then(info => console.log(info)).catch(err => console.error(err));
```