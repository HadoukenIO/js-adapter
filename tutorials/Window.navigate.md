Navigates the window to a specified URL.

# Example
```js
async function navigate() {
    const win = await fin.Window.getCurrent();
    return await win.navigate('https://www.google.com');
}
navigate().then(() => console.log('Navigate to goole')).catch(err => console.log(err));
```
