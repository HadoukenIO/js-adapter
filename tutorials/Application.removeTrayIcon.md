Removes the application’s icon from the tray.
# Example
```js
async function removeTrayIcon() {
    const app = await fin.Application.getCurrent();
    return await app.removeTrayIcon();
}

removeTrayIcon().then(() => console.log('Removed the tray icon.')).catch(err => console.log(err));
```
