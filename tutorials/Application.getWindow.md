Returns an instance of the main Window of the application
### Example
```js
async function getWindow() {
		const app = await fin.Application.create({
			uuid: Math.random.toString(16).slice(2),
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
.catch(err => console.log(err));
```
