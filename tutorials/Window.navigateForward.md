Navigates the window forward one page.
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

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
