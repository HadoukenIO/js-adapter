Creates and runs the application. There is no need to call run on an application when used with start.
# Example
```js
async function start() {
    return fin.Application.start({
        name: 'app-1',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Application.start.html',
        autoShow: true
    });
}
start().then(() => console.log('Application is running')).catch(err => console.log(err));
```
