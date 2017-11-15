Navigates the window back one page.

# Example
```js
async function navigateBack() {
    const win = await fin.Window.wrap({ name: 'testapp', uuid: 'testapp' });
    await win.navigate('https://www.google.com');
    return await win.navigateBack();
}
navigateBack().then(() => console.log('Navigated back')).catch(err => console.log(err));
```
