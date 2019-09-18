Updates the external window using the passed options

# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

const wrappedWindow = await wrapNotepad();
const initialOptions = await wrappedWindow.getOptions();
console.log(`Initial options: ${initialOptions}`);
await wrappedWindow.updateOptions({
    noneOfThisWorksAnyhow: true
});
const finalOptions = await wrappedWindow.getOptions();
console.log(`Final options: ${finalOptions}`);
```