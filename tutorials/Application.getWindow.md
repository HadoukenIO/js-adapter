Returns an instance of the main Window of the application
### Example
```js
async function getWindow() {
		const app = await fin.Application.create({ uuid, name: "myApp" });
		await app.run();
		return await app.getWindow();
}
getWindow().then(win => console.log(win));
```
