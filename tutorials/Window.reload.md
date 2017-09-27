Reloads the window current page.

# Example
```js
async function reloadWindow() {
		const app = await fin.Application.create({
				name: 'myApp',
				uuid: 'app-1',
				url: 'https://www.google.com',
				autoShow: true
		});
		await app.run();
		const win = await app.getWindow();
    return await win.reload();
}

reloadWindow().then(() => {
		console.log('Reloaded window')
}).catch(err => console.log(err));
```
