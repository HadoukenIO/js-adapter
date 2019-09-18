Stops the taskbar icon from flashing

__note__: On macOS flash only works on inactive windows.
# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

const wrappedWindow = await wrapNotepad();
await wrappedWindow.flash();
console.log('Wrapped Notepad window is flashing')
setTimeout(async () => {
    await wrappedWindow.stopFlashing();
    console.log('Wrapped Notepad window is no longer flashing');
}, 3000);
```
