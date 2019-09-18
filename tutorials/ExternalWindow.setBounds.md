Sets the external window's size and position.

# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

const wrappedWindow = await wrapNotepad();
let bounds = await wrappedWindow.getBounds();
console.log(`1. Current bounds: ${bounds}`);
await wrappedWindow.setBounds({
    height: 100,
    width: 200,
    top: 400,
    left: 400
});
bounds = await wrappedWindow.getBounds();
console.log(`2. Current bounds: ${bounds}`);
```