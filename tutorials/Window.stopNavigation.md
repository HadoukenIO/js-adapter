Stops any current navigation the window is performing.

# Example
```js
var win = fin.Window.wrap({ name: fin.me.uuid, uuid: fin.me.uuid });

win.navigate('https://www.google.com').then(() => {
		app.stopNavigation().then(() => console.log('you shall not navigate')).catch(err => console.log(err));
}).catch(err => console.log(err));
```
