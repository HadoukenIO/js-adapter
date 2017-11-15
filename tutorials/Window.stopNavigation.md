Stops any current navigation the window is performing.

# Example
```js
async function stopNavigation() {
    const win = await fin.Window.wrap({ name: 'testapp', uuid: 'testapp' });
    await win.navigate('https://www.google.com');
    return await win.stopNavigation();
}
stopNavigation().then(() => console.log('you shall not navigate')).catch(err => console.log(err));
```
