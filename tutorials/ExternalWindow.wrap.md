Asynchronously returns an ExternalWindow object that represents an existing non-OpenFin window.
# Example
```js
const externalWindows = await fin.System.getAllExternalWindows();
// Assuming a single instance of notepad is currently open
const notepad = externalWindows.find(win => win.name === 'Notepad');
const wrappedNotepad = await fin.ExternalWindow.wrap(notepad);
```

