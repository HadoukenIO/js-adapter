Resizes the external window by a specified amount.

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
console.log(`1. Current dimensions - width: ${bounds.width}, height: ${bounds.height}`);
await wrappedWindow.resizeBy(100, 100, 'top-right');
bounds = await wrappedWindow.getBounds();
console.log(`2. Current dimensions - width: ${bounds.width}, height: ${bounds.height}`);
```