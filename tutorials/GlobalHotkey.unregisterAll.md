Unregisters all global hotkeys for the current application.

Raises the `unregistered` event for each hotkey unregistered.

# Example
```js
fin.GlobalHotkey.unregisterAll()
.then(() => {
    console.log('Success');
})
.catch(err => {
    console.log('Error unregistering all hotkeys for this application', err);
});
```
