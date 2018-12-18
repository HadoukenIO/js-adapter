Retrieves information about the application.  If the application was not launched from a manifest, the call will return the closest parent application `manifest` and `manifestUrl`.  `initialOptions` shows the parameters used when launched programmatically, or the `startup_app` options if launched from manifest.  The `parentUuid` will be the uuid of the immediate parent (if applicable).

#### response
```
{
    initialOptions: {
        name: "myApp",
        url: "https://openfin.co",
        uuid: "myApp",
        autoShow: true
    },
    launchMode: 'fin-protocol' || 'fins-protocol' || 'shortcut' || 'command-line' || 'adapter' || 'other' || a process name (ex: 'openfin.exe'),
    manifestUrl: "https://cdn.openfin.co/myapp",
    manifest: {
        startup_app:{
            name: "myApp",
            url: "https://openfin.co",
            uuid: "myApp",
            autoShow: true
        },
        runtime: {
            arguments: "--v=1",
            version: "9.61.31.51"
        }
    },
    parentUuid: null,
    runtime: {
        version: "*.*.*.*"
    }
}
```

# Example
```js
async function getInfo() {
    const app = await fin.Application.getCurrent();
    return await app.getInfo();
}

getInfo().then(info => console.log(info)).catch(err => console.log(err));
```
