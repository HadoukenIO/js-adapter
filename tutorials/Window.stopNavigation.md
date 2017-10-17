Stops any current navigation the window is performing.

# Example
```js
<<<<<<< HEAD
var win = fin.Window.wrap({ name: fin.me.uuid, uuid: fin.me.uuid });

win.navigate('https://www.google.com').then(() => {
		app.stopNavigation().then(() => console.log('you shall not navigate')).catch(() => console.log(err));
=======
var win = fin.Window.wrap({ name: 'testapp', uuid: 'testapp' });

win.navigate('https://www.google.com').then(() => {
		win.stopNavigation().then(() => console.log('you shall not navigate')).catch(() => console.log(err));
>>>>>>> feature/stopNavigation
}).catch(err => console.log(err));
```
