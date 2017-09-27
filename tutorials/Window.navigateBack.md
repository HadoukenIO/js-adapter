Navigates the window back one page.

# Example
```js
var win = fin.Window.wrap({ name: 'testapp', uuid: 'testapp' });

win.navigate('https://www.google.com').then(() => {
      console.log('Navigating')
      win.navigateBack().then(() => console.log('Navigated back')).catch(err => console.log(err));
}).catch(err => console.log(err));
```
