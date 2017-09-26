Stops any current navigation the window is performing.
# Example
```js
var app = fin.Window.wrap({ name: fin.me.uuid, uuid: fin.me.uuid });

app.navigate('https://www.google.com').then(() => {
		app.stopNavigation().then(() => console.log('you shall not navigate')).catch(() => console.log(err));
}).catch(err => console.log(err));
```
