Closes the application and any child windows created by the application.
# Example

```js
async function close_app() {
    const app = await fin.Application.create({
        uuid: 'app-1',
        name: 'myApp',
        url: 'https://openfin.co',
        autoShow: true
    });
    
    await app.run();
    return await app.close();
}

close_app().then(() => console.log('Application was closed')).catch(err => console.error(err));
```