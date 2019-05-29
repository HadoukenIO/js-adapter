Executes Javascript on the window, restricted to windows you own or windows owned by applications you have created.
<br>__note__: This method is not applicable for <a href="ExternalWindow.html"> External Windows</a>.

# Example
```js
async function executeJavaScript(code) {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.executeJavaScript.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.executeJavaScript(code);
}

executeJavaScript(`console.log('Hello, Openfin')`).then(() => console.log('Javascript excuted')).catch(err => console.log(err));
```
