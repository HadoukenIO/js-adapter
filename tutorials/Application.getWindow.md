Returns an instance of the main Window of the application
### Example
```js
.then(fin => {

	getWindow(fin)
	.then(win => win.showAt(0, 400))
	.catch(err => console.log(err))
})
.catch(err => console.log(err))

async function getWindow(fin) {
	const app = await fin.Application.create({
		uuid: Math.random().toString(36).slice(2),
		name: 'myApp',
		url: 'https://www.google.com',
		autoShow: true
	})
	await app.run()
	return await app.getWindow()
}
```
