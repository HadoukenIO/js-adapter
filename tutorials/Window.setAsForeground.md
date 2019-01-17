Will bring the window to the front of the entire stack and give it focus

# Example
```js
async function createWin() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.setAsForeground.html',
        autoShow: true
    });
    await app.run();
    return await app.getWindow();
}

async function setAsForeground() {
    const app = await createWin();
    return await app.setAsForeground()
}

setAsForeground().then(() => console.log('In the foreground')).catch(err => console.log(err));
```
