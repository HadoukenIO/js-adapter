Writes data into the clipboard as Html
# Example
```js
async function writeHtml(stdin) {
    return await fin.Clipboard.writeHtml({
        data: stdin,
        type: 'html'
    });
}

writeHtml('<h1>Hello, World!</h1>').then(() => console.log('On clipboard')).catch(err => console.log(err));
```
