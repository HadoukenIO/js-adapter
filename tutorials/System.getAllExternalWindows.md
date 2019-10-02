Retrieves an array of data for all available external windows (`name`, `nativeId`, `uuid` if window was previously wrapped via `ExternalWindow.wrap`).
# Example
```js
const externalWindows = await fin.System.getAllExternalWindows();
console.log(externalWindows);
// ExternalWindow info objects can be wrapped and acted upon via the `ExternalWindow` API:
const notepadObj = externalWindows.find(win => win.name.toLowerCase() === 'notepad'); // Assumes this window exists
const wrappedNotepad = await fin.ExternalWindow.wrap(notepadObj);
// We can now take actions on wrapped notepad window:
wrappedNotepad.moveBy(100, 100);
```
