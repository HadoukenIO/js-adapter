Gets the current bounds (top, bottom, right, left, width, height) of the external window.

Returned object will have the following shape:
```ts
{
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
```

# Example
```js
async function wrapNotepad() {
    const externalWindows = await fin.System.getAllExternalWindows();
    // Assuming a single instance of notepad is currently open
    const notepad = externalWindows.find(win => win.name === 'Notepad');
    return await fin.ExternalWindow.wrap(notepad);
}

wrapNotepad()
    .then(externalWindow => externalWindow.getBounds())
    .then(bounds => console.log(bounds))
    .catch(err => console.error(err));
```
