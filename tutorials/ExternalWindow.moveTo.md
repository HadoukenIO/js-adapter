Moves the external window to a specified location

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
await wrappedWindow.moveTo(100, 100); // 100px left, 100px top
bounds = await wrappedWindow.getBounds(); // { left: 100, top: 100, ... }
console.log(`2. Current location - left: ${bounds.left}, top: ${bounds.top}`);
```