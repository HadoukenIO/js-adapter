Adds a customizable icon in the system tray and notifies the application when clicked.
# Example
```js
async function setTrayIcon() {
    const iconUrl = "http://cdn.openfin.co/assets/testing/icons/circled-digit-one.png";
    const app = await fin.Application.getCurrent();
    return await app.setTrayIcon(iconUrl);
}

setTrayIcon().then(clickInfo => console.log(clickInfo)).catch(err => console.log(err));
```
