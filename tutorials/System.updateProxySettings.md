Update the OpenFin Runtime Proxy settings.
# Example

```js
fin.System.updateProxySettings({
    proxyAddress: 'https://www.google.com',
    proxyPort: '',
    type: 'named'
}).then(() => console.log('Updated proxy settings')).catch(err => console.error(err));
```