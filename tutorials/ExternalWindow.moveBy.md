Moves the external window by a specified amount

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
console.log(`1. Current location - left: ${bounds.left}, top: ${bounds.top}`);
await wrappedWindow.moveBy(100, 100); // 100px right, 100px down
bounds = await wrappedWindow.getBounds();
console.log(`2. Current location - left: ${bounds.left}, top: ${bounds.top}`);
```