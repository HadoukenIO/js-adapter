Shows the Chromium Developer Tools for the specified window
# Example

```js
fin.System.showDeveloperTools({
    uuid: 'testapp'
}).then(() => console.log('Developer tools are open')).catch(err => console.error(err));
```