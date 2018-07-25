Update the OpenFin Runtime Proxy settings.
# Example
```js
fin.System.updateProxySettings({proxyAddress:'127.0.0.1', proxyPort:8080, type:'http'})
.then(() => console.log('Update proxy successfully'))
.catch(err => console.error(err));
```
