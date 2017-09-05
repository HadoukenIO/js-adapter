Opens the passed URL in the default web browser.
#Example
```js
async function openInBrowser(url) {
    return await fin.System.openUrlWithBrowser(url);
}

openInBrowser('https://www.openfin.co')
.then(resp => console.log(resp));
.catch(err => console.log(err));
```
