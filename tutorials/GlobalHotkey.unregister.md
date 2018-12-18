Unregisters a global hotkey with the operating system. This method will unregister all existing registrations of the hotkey within the application.

Raises the `unregistered` event.

# Example
```js
const hotkey = 'CommandOrControl+X';

fin.GlobalHotkey.unregister(hotkey)
.then(() => {
    console.log('Success');
})
.catch(err => {
    console.log('Error unregistering the hotkey', err);
});
```
