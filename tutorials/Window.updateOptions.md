Updates the window using the passed options
# Example
```js
async function updateOptions() {
    const win = await fin.Window.getCurrent();
    return win.updateOptions({maxWidth: 100});
}
updateOptions().then(() => console.log('options is updated')).catch(err => console.error(err));
```
