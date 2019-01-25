Closes the application and any child windows created by the application. Removes it from runtime state.
# Example
```js
async function closeApp() {
    const allApps1 = await fin.System.getAllApplications(); //[{uuid: 'app1', isRunning: true}, {uuid: 'app2', isRunning: true}]
    const app = await fin.Application.wrap({uuid: 'app2'});
    await app.quit();
    const allApps2 = await fin.System.getAllApplications(); //[{uuid: 'app1', isRunning: true}]

}
closeApp().then(() => console.log('Application quit')).catch(err => console.log(err));
```
