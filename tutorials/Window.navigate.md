Navigates the window to a specified URL.

# Example
```js
async function createWin() {
		const app = await fin.Application.create({
				name: 'myApp',
				uuid: 'app-1',
				url: 'https://www.openfin.co',
				autoShow: true
		});
		await app.run();
		return await app.getWindow();
}

async function navigate(url) {
		const app = await createWin();
		return await app.navigate(url);
}

navigate('https://www.google.com').then(() => {
		console.log('Navigated window')
}).catch(err => console.log(err));
```
