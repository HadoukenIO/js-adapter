Navigates the window forward one page

# Example
```js
var win = fin.Window.wrap({ name: 'testapp', uuid: 'testapp' });

win.navigateForward().then(() => console.log('Navigating forward')).catch(err => console.log(err));
```
