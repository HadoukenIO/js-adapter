Sets new application's shortcut configuration
# Example
```js
async function setShortcuts(config) {
    const app = await fin.Application.start({
            uuid: 'app-1',
            name: 'myApp',
            url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Application.setShortcuts.html',
            autoShow: true
    });
    return await app.getWindow().setShortcuts(config);
}

setShortcuts({
    desktop: true,
    startMenu: false,
    systemStartup: true
}).then(() => console.log('Shortcuts are set.')).catch(err => console.log(err));
```
