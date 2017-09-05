Read the content of the clipboard as Html
# Example
```js
async function readHtml() {
    return await fin.Clipboard.readHtml();
}

readHtml().then(stdout => console.log(stdout)).catch(err => console.log(err));
```
