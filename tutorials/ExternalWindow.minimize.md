Minimizes the external window.

# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

const wrappedWindow = await wrapNotepad();
await wrappedWindow.minimize();
let state = await wrappedWindow.getState(); // 'minimized'
console.log(`1. Notepad state: ${state}`);
await wrappedWindow.restore();
state = await wrappedWindow.getState(); // 'normal'
console.log(`2. Notepad state: ${state}`);
```