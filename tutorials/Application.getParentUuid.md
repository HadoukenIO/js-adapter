Retrieves UUID of the application that launches this application.
# Example
```js
async function getParentUuid() {
    const app = await fin.Application.start({
        uuid: 'app-1',
        name: 'myApp',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Application.getParentUuid.html',
        autoShow: true
    });
    return await app.getParentUuid();
}

getParentUuid().then(parentUuid => console.log(parentUuid)).catch(err => console.log(err));
```
