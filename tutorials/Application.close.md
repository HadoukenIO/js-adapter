Closes the application and any child windows created by the application.
# Example
```js
async function closeApp() {
    const app = await fin.Application.getCurrent();
    return await app.close();
}
closeApp().then(() => console.log('Application closed')).catch(err => console.log(err));
```
