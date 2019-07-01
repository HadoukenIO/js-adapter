Reloads the window current page.

# Example
```js
async function reloadWindow() {
		const app = await fin.Application.start({
				name: 'myApp',
				uuid: 'app-1',
				url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.reload.html',
				autoShow: true
		});
		const win = await app.getWindow();
    return await win.reload();
}

reloadWindow().then(() => {
		console.log('Reloaded window')
}).catch(err => console.log(err));
```
