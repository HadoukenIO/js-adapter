Writes data into the clipboard as plain text
#Example
```js
async function writeToClipborad(stdin) {
    return await fin.Clipboard.writeText({
        data: stdin
    });
}

writeToClipborad('hello, world');
```
