Retrieves the JSON manifest that was used to create the application. Invokes the error callback if the application was not created from a manifest.
# Example

```js
async function getManifest() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.getManifest();
}

getManifest().then(manifest => console.log(manifest)).catch(err => console.error(err));
```