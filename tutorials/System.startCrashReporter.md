Start the crash reporter for the browser process if not already running.You can optionally specify `diagnosticMode` to have the logs sent to
OpenFin on runtime close
# Example
```js
fin.System.startCrashReporter({diagnosticMode: true}).then(reporter => console.log(reporter)).catch(err => console.log(err));
```
