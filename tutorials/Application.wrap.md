Asynchronously returns an Application object that represents an existing application.
# Example
```js
fin.Application.wrap({ uuid: 'testapp' })
.then(app => app.isRunning())
.then(running => console.log('Application is running: ' + running))
.catch(err => console.log(err));
```
