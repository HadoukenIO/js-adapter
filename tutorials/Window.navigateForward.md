Navigates the window forward one page.

# Example
```js
async function navigateForward() {
    const win = await fin.Window.getCurrent();
    await win.navigate('https://www.google.com');
    await win.navigateBack();
    return await win.navigateForward();
}
navigateForward().then(() => console.log('Navigated forward')).catch(err => console.log(err));
```
