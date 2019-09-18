Gives focus to the external window

# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

wrapNotepad()
    .then(externalWindow => externalWindow.focus())
    .then(() => console.log('Wrapped Notepad window is focused'))
    .catch(err => console.error(err));
```
