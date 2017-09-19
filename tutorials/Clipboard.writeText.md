Writes data into the clipboard as plain text
# Example
```js
fin.Clipboard.writeText({
    data: 'hello, world'
}).then(() => console.log('Text On clipboard')).catch(err => console.log(err));
```
