Retrieves the Proxy settings
# Example
```js
async function getProxySettings() {
    return await fin.System.getProxySettings();
}

getProxySettings().then(ProxySetting => console.log(ProxySetting)).catch(err => console.log(err));
```
