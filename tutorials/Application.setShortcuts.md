Sets new shortcut configuration for current application. Application has to be launched with a manifest and has to have shortcut configuration (icon url, name, etc.) in its manifest to be able to change shortcut states. Windows only.
# Example
```js
async function setShortcuts(config) {
    const app = await fin.Application.getCurrent();
    return app.setShortcuts(config);
}

setShortcuts({
    desktop: true,
    startMenu: false,
    systemStartup: true
}).then(() => console.log('Shortcuts are set.')).catch(err => console.log(err));
```
