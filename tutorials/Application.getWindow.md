Returns an instance of the main Window of the application
# Example
```js
async function getWindow() {
		const app = await fin.Application.create({
			uuid: 'app-1',
			name: 'myApp',
			url: 'https://openfin.co',
			autoShow: true
		});
		await app.run();
		return await app.getWindow();
}

getWindow()
.then(win => {
		win.showAt(0, 400);
		win.flash();
})
.catch(console.error);
```
