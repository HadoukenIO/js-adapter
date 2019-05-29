Removes focus from the window
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
async function blurWindow() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.blur.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.blur();
}

blurWindow().then(() => console.log('Blured Window')).catch(err => console.log(err));
```
