Given an object with a name key containing the name of the service for which you would like the configuration, `getServiceConfiguration` will return the JSON blob found in the [desktop owner settings](https://openfin.co/documentation/desktop-owner-settings/) file for the specified service. More information about desktop services can be found [here](https://developers.openfin.co/docs/desktop-services). This call will reject if the desktop owner settings file is not present, not correctly formatted, or if the service requested is not configured or configured incorrectly.



# Example
Here we are using the [layouts](https://github.com/HadoukenIO/layouts-service) service.
```js
fin.System.getServiceConfiguration({name:'layouts'}).then(console.log).catch(console.error)
```
