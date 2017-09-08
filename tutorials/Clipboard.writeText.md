Writes data into the clipboard as plain text
#Example
```js
async function writeToClipborad(input) {
    return await fin.Clipboard.writeText({
        data: input
    });
}

writeToClipborad('hello, world').then('On clipboard').catch(err => console.log(err));
```
