Registers a global hotkey with the operating system. The `hotkey` parameter expects an electron compatible [accelerator](https://github.com/electron/electron/blob/master/docs/api/accelerator.md) and the `listener` will be called if the `hotkey` is pressed by the user. If successfull, the hotkey will be 'claimed' by the application, meaning that this register call can be called multiple times from within the same application but will fail if another application has registered the hotkey.

The register call will fail if given any of these reserved Hotkeys:
* `CommandOrControl+0`
* `CommandOrControl+=`
* `CommandOrControl+Plus`
* `CommandOrControl+-`
* `CommandOrControl+_`
* `CommandOrControl+Shift+I`
* `F5`
* `CommandOrControl+R`
* `Shift+F5`
* `CommandOrControl+Shift+R`

Raises the `registered` event.

# Example
```js
const hotkey = 'CommandOrControl+X';

fin.GlobalHotkey.register(hotkey, () => {
    console.log(`${hotkey} pressed`);
})
.then(() => {
    console.log('Success');
})
.catch(err => {
    console.log('Error registering the hotkey', err);
});
```
