Writes data into the clipboard as Html
# Example
```js
fin.Clipboard.writeHtml({
        data: '<h1>Hello, World!</h1>'
}).then(() => console.log('HTML On clipboard')).catch(err => console.log(err));
```
