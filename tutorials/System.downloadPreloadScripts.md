Download preload scripts from given URLs.

# Example
```js
const scripts = [
    { url: 'http://.../preload.js' },
    { url: 'http://.../preload2.js' }
];

fin.System.downloadPreloadScripts(scripts).then(results => {
    results.forEach(({url, success, error}) => {
        console.log(`URL: ${url}`);
        console.log(`Success: ${success}`);
        if (error) {
            console.log(`Error: ${error}`);
        }
    });
});
```
