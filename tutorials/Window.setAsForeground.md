Will bring the window to the front of the entire stack and give it focus

# Example
```js
async function createWin() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.setAsForeground.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function setAsForeground() {
    const win = await createWin();
    return await win.setAsForeground()
}

setAsForeground().then(() => console.log('In the foreground')).catch(err => console.log(err));
```
