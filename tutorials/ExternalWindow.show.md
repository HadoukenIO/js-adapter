Shows the external window if it is hidden

# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

const wrappedWindow = await wrapNotepad();
await wrappedWindow.hide();
let isShowing = await wrappedWindow.isShowing(); // false
console.log(`1. Notepad is showing: ${isShowing}`);
await wrappedWindow.show();
isShowing = await wrappedWindow.isShowing(); // true
console.log(`2. Notepad is showing: ${isShowing}`);
```