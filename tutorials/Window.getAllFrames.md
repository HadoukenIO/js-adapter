Retrieves an array of frame info objects representing the main frame and any
iframes that are currently on the page.

# Example
```js
async function getAllFrames() {
    const app = await fin.Application.create({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://www.openfin.co',
        autoShow: true
    });
    await app.run();
    const win = await app.getWindow();
    return await win.getAllFrames();
}

getAllFrames().then(framesInfo => console.log(framesInfo)).catch(err => console.log(err));
```
