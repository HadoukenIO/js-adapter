Brings the external window to the front of the window stack
# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

wrapNotepad()
    .then(wrappedWindow => wrappedWindow.bringToFront())
    .then(() => console.log('Notepad is top window'))
    .catch(err => console.error(err));
```
