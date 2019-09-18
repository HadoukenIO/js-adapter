Flashes the external window’s frame and taskbar icon until stopFlashing is called or until a focus event is fired.

__note__: On macOS flash only works on inactive windows.
# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

wrapNotepad()
    .then(externalWindow => externalWindow.flash())
    .then(() => console.log('Wrapped Notepad window is flashing'))
    .catch(err => console.error(err));
```
