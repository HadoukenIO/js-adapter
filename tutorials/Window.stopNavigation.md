Stops any current navigation the window is performing.

# Example
```js
const win = fin.Window.wrap({ name: fin.me.uuid, uuid: fin.me.uuid });

win.navigate('https://www.google.com').then(() => {
	win.stopNavigation().then(() => console.log('you shall not navigate.')).catch(console.error);
}).catch(console.error);
```
