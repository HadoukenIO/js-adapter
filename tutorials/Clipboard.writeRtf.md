Writes data into the clipboard as Rtf
# Example
```js
fin.Clipboard.writeRtf({
        data: 'some text goes here'
}).then(() => console.log('RTF On clipboard')).catch(err => console.log(err));
```
