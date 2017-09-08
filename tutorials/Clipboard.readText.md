Read the content of the clipboard as plain text
# Example
```js
async function readText() {
    return await fin.Clipboard.readText();
}

readText().then(output => console.log(output)).catch(err => console.log(err));
```
