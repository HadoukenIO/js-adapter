Brings the window to the front of the window stack
# Example
```js
async function BringWindowToFront() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.bringToFront.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.bringToFront();
}

BringWindowToFront().then(() => console.log('Window is in the front')).catch(err => console.log(err));
```
