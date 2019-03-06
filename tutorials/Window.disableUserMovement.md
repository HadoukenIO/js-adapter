Prevents a user from changing a window's size/position when using the window's frame
# Example
```js
async function disableUserMovement() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-3',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.disableFrame.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.disableUserMovement();
}

disableUserMovement().then(() => console.log('Window is disabled')).catch(err => console.log(err));
```
