Retrieves application's manifest and returns a wrapped and running application.
# Example
```js
fin.Application.startFromManifest('http://localhost:5555/app.json').then(app => console.log('App is running')).catch(err => console.log(err));

// For a local manifest file:
fin.Application.startFromManifest('file:///C:/somefolder/app.json').then(app => console.log('App is running')).catch(err => console.log(err));
```

