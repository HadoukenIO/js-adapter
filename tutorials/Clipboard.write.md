Writes data into the clipboard
# Example
```js
fin.Clipboard.write({
        data: {text: 'a', html: 'b', rtf: 'c'}
}).then(() => console.log('write data into clipboard')).catch(err => console.log(err));
```
