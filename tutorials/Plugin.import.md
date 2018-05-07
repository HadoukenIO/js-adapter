Imports an OpenFin plugin. Plugins can be written using ES modules, and the API object that
is resolved in the promise contains the exported API of the plugin.

### Example

```js
// This plugin must be listed in root application's manifest
fin.desktop.Plugin.import('foo')
    .then((api) => {
        api.bar();
    })
    .catch(console.error);
```
