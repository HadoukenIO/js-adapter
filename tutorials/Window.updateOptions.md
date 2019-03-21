Updates the window using the passed options. Values that are objects are deep-merged, overwriting only the values that are provided.

# Example
```js
async function updateOptions() {
    const win = await fin.Window.getCurrent();
    return win.updateOptions({maxWidth: 100});
}
updateOptions().then(() => console.log('options is updated')).catch(err => console.error(err));
```
