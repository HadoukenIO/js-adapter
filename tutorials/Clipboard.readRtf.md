Read the content of the clipboard as Rtf
# Example
```js
const writeObj = {
    data: 'some text goes here'
};
async function readRtf() {
    await fin.Clipboard.writeRtf(writeObj);
    return await fin.Clipboard.readRtf();
}
readRtf().then(rtf => console.log(rtf)).catch(err => console.log(err));
```
