Provides credentials to authentication requests

# Example
```js
fin.Application.wrap({uuid: 'OpenfinPOC'}).then(app => {
    app.on('window-auth-requested', evt => {
        let win = fin.Window.wrap({ uuid: evt.uuid, name: evt.name});
        win.authenticate('userName', 'P@assw0rd').then(()=> console.log('authenticated')).catch(err => console.log(err));
    });
});
```
