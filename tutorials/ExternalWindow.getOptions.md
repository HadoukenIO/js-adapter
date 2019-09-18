Gets the current settings of the external window

#### Response
```js
{
  alwaysOnTop: false,
  frame: true,
  maximizable: true,
  name: 'Notepad',
  opacity: 1,
  resizable: true,
  showTaskbarIcon: true,
  uuid: 'bc94d66e-7d35-448f-bbd0-278dbd6e6c48'
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
    .then(externalWindow => externalWindow.getOptions())
    .then(options => console.log(options))
    .catch(err => console.error(err));
```
