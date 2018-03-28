Imports an OpenFin plugin. Plugins can be written using ES modules, and the API object that 
is resolved in the promise contains the exported API of the plugin.

### Example

```js
// This plugin must be listed in root application's manifest
const plugin = {
    name: 'foo',
    version: '0.0.1'
};

fin.desktop.Plugin.import(plugin)
    .then((api) => {
        api.bar();
    })
    .catch(console.error);
```
