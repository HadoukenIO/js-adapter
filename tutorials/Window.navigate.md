Navigates the window to a specified URL.

# Example
```js
async function navigate() {
    const win = await fin.Window.getCurrent();
    return await win.navigate('https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.navigate.html');
}
navigate().then(() => console.log('Navigate to tutorial')).catch(err => console.log(err));
```
