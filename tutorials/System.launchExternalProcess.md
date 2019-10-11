Runs an executable or batch file.
**Note:** Since _appAssets_ relies on the RVM, which is missing on MAC_OS, 'alias' is not available. Instead provide the full path e.g. _/Applications/Calculator.app/Contents/MacOS/Calculator_.

### Examples
#### Basic Example
```js
fin.System.launchExternalProcess({
    path: 'notepad',
    arguments: '',
    listener: (result) => {
        console.log('the exit code', result.exitCode);
    }
}).then((processIdentity) => {
    console.log(processIdentity);
}).catch((error) => {
    console.log(error);
});
```

####  Promise resolution

```js
//This response has the following shape:
{
    uuid: "FB3E6E36-0976-4C2B-9A09-FB2E54D2F1BB" // The mapped UUID which identifies the launched process
}
```

#### Listener callback
```js
//This response has the following shape:
{
    topic: "exited", // Or "released" on a call to releaseExternalProcess
    uuid: "FB3E6E36-0976-4C2B-9A09-FB2E54D2F1BB", // The mapped UUID which identifies the launched process
    exitCode: 0 // Process exit code
}
```

#### Example specifying a lifetime for an external process

By specifying a lifetime, an external process can live as long the window/application that launched it or persist after the application exits. The default value is null, which is equivalent to 'persist', meaning the process lives on after the application exits.

```js
fin.System.launchExternalProcess({
    path: 'notepad',
    arguments: '',
    listener: (result) => {
        console.log('the exit code', result.exitCode);
    },
    lifetime: 'window'
}).then((processIdentity) => {
    console.log(processIdentity);
}).catch((error) => {
    console.log(error);
});
```

Note: A process that exits when the window/application exits cannot be released via fin.desktop.System.releaseExternalProcess.

#### Example using an alias from app.json appAssets property

```json
"appAssets": [
    {
        "src": "exe.zip",
        "alias": "myApp",
        "version": "4.12.8",
        "target": "myApp.exe",
        "args": "a b c d"
    },
]
```

```js
/*
 * When called, if no arguments are passed then the arguments (if any)
 * are taken from the 'app.json' file, from the  'args' parameter
 * of the 'appAssets' Object with the relevant 'alias'.
 */
fin.System.launchExternalProcess({
    //Additionally note that the executable found in the zip file specified in appAssets
    //will default to the one mentioned by appAssets.target
    //If the the path below refers to a specific path it will override this default
    alias: 'myApp',
    listener: (result) => {
        console.log('the exit code', result.exitCode);
    }
}).then((processIdentity) => {
    console.log(processIdentity);
}).catch((error) => {
    console.log(error);
});
```

#### Example using an alias but overriding the arguments

```json
"appAssets": [
    {
        "src": "exe.zip",
        "alias": "myApp",
        "version": "4.12.8",
        "target": "myApp.exe",
        "args": "a b c d"
    },
]
```

```js
/*
 * If 'arguments' is passed as a parameter it takes precedence
 * over any 'args' set in the 'app.json'.
 */
fin.System.launchExternalProcess({
    alias: 'myApp',
    arguments: 'e f g',
    listener: (result) => {
        console.log('the exit code', result.exitCode);
    }
}).then((processIdentity) => {
    console.log(processIdentity);
}).catch((error) => {
    console.log(error);
});
```

#### Certificate Validation

It is now possible to optionally perform any combination of the following certificate checks against an absolute target via `fin.desktop.System.launchExternalProcess()`.

```js
"certificate": {
    "serial": "3c a5 ...",                        // A hex string with or without spaces
    "subject": "O=OpenFin INC., L=New York, ...", // An internally tokenized and comma delimited string allowing partial or full checks of the subject fields
    "publickey": "3c a5 ...",                     // A hex string with or without spaces
    "thumbprint": "3c a5 ...",                    // A hex string with or without spaces
    "trusted": true                               // A boolean indicating that the certificate is trusted and not revoked
}
```

Providing this information as part of the default configurations for assets in an application's manifest will be added in a future RVM update.

```js
fin.System.launchExternalProcess({
    path: 'C:\\Users\\ExampleUser\\AppData\\Local\\OpenFin\\OpenFinRVM.exe',
    arguments: '--version',
    certificate: {
        trusted: true,
        subject: 'O=OpenFin INC., L=New York, S=NY, C=US',
        thumbprint: '‎3c a5 28 19 83 05 fe 69 88 e6 8f 4b 3a af c5 c5 1b 07 80 5b'
    },
    listener: (result) => {
        console.log('the exit code', result.exitCode);
    }
}).then((processIdentity) => {
    console.log(processIdentity);
}).catch((error) => {
    console.log(error);
});
```

#### Example launching a file downloaded by the user

It is possible to launch files that have been downloaded by the user by listening to the window `file-download-completed` event and using the `fileUuid` provided by the event.

```js
const win = fin.Window.getCurrentSync();

win.addListener('file-download-completed', (evt) => {
    if (evt.state === 'completed') {
        fin.System.launchExternalProcess({
            fileUuid: evt.fileUuid,
            arguments: '',
            listener: (result) => {
                console.log('the exit code', result.exitCode);
            }
        }).then((processIdentity) => {
            console.log(processIdentity);
        }).catch((error) => {
            console.log(error);
        });
    }
});
```
