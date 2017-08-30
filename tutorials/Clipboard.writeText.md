writes 'Hello, world' to clipboard
#Example
```js
async writeToClipborad(stdin) {
    return fin.Clipboard.writeText({
        data: stdin
    })
}

writeToClipborad('hello, world')
.then(clipboard => console.log( clipboard ))
.catch(err => console.log( err ))
```
