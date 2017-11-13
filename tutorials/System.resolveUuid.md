Retrieves the UUID of the computer on which the runtime is installed
# Example

```js
fin.System.resolveUuid('testapp').then(resp => console.log(resp)).catch(err => console.error(err));
```