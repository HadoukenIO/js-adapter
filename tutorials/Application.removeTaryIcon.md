Removes the application’s icon from the tray.
# Example

```js
async function removeTrayIcon() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.removeTrayIcon();
}

removeTrayIcon().then(() => console.log('Removed Tray Icon.')).catch(err => console.error(errr));
```