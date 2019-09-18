Gets an information object for the external window.

#### Response
```js
{
  name: '',
  nativeId: '0x00000000',
  process: {
    injected: false,
    pid: 0
  },
  title: '',
  visible: false,
  alwaysOnTop: false,
  bounds: {
    x: 0,
    y: 0,
    width: 600,
    height: 600
  },
  className: '',
  dpi: 96,
  dpiAwareness: -1,
  focused: false,
  maximized: false,
  minimized: false
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
    .then(externalWindow => externalWindow.getInfo())
    .then(info => console.log(info))
    .catch(err => console.error(err));
```
