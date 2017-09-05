Clears cached data containing window state/positions, application resource files (images, HTML, JavaScript files), cookies, and items stored in the Local Storage
# Example
```js
async function clearCache() {
    return await fin.System.clearCache();
}

clearCache().then(() => console.log('cache cleared')).catch(err => console.log(err));

```
