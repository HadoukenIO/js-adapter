Checks if a given hotkey has been registered.

# Example
```js
const hotkey = 'CommandOrControl+X';

fin.GlobalHotkey.isRegistered(hotkey)
.then((registered) => {
    console.log(`hotkey ${hotkey} is registered ? ${registered}`);
})
.catch(err => {
    console.log('Error unregistering the hotkey', err);
});
```
