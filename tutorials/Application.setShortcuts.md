Sets new application's shortcut configuration

# Example
```js
async function createWin(config) {
		const app = await fin.Application.create({
			uuid: 'app-1',
			name: 'myApp',
			url: 'https://openfin.co',
			autoShow: true
		});
		await app.run();
		return await app.getWindow();
}

async function setShortcuts(config) {
    const app = await createWin();
    return await app.setShortcuts(config);
}

setShortcuts({
		desktop: true,
		startMenu: false,
		systemStartup: true
}).then(() => console.log('Shortcuts are set.')).catch(err => console.log(err));
```
