Retrieves the Proxy settings
# Example
```js
fin.System.getProxySettings().then(ProxySetting => console.log(ProxySetting)).catch(err => console.log(err));
```
#### Proxy Settings
```js
//This response has the following shape:
{
    config: {
        proxyAddress: "proxyAddress", //the configured Proxy Address
        proxyPort: 0, //the configured Proxy port
        type: "system" //Proxy Type
    },
    system: {
        autoConfigUrl: "",
        bypass: "",
        enabled: false,
        proxy: ""
    }
}
```
