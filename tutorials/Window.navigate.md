Navigates the window to a specified URL.

# Example
```js
async function navigate(url) {
	const app = await fin.Application.create({
			name: 'myApp',
			uuid: 'app-1',
			url: 'https://www.openfin.co',
			autoShow: true
	});

	await app.run();
	
	const win = await app.getWindow();
	return await win.navigate(url);
}

navigate('https://www.google.com').then(() => {
	console.log('Navigated window')
}).catch(err => console.log(err));
```
