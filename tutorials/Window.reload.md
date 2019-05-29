Reloads the window current page.
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

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
