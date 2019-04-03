# DEPRECATED use Application.startFromManifest instead
Retrieves application's manifest and returns a wrapped application.
# Example
```js
fin.Application.createFromManifest('http://localhost:5555/app.json').then(app => console.log(app)).catch(err => console.log(err));
```
