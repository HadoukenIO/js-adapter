Retrieves UUID of the application that launches this application.
# Example
```js
async function getParentUuid() {
    const app = await fin.Application.create({
        uuid: 'app-1',
        name: 'myApp',
        url: 'https://openfin.co',
        autoShow: true
    });
    await app.run();
    return await app.getParentUuid();
}

getParentUuid().then(parentUuid => console.log(parentUuid)).catch(err => console.log(err));
```
