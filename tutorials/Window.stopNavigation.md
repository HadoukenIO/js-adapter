Stops any current navigation the window is performing.

# Example
```js
var win = fin.Window.wrap({ name: 'testapp', uuid: 'testapp' });

win.navigate('https://www.google.com').then(() => {
		win.stopNavigation().then(() => console.log('you shall not navigate')).catch(() => console.log(err));
}).catch(err => console.log(err));
```
