Clears cached data containing application resource files (images, HTML, JavaScript files), cookies, and items stored in the Local Storage
# Example
```js
const clearCacheOptions = {
    appcache: true,
    cache: true,
    cookies: true,
    localStorage: true
};
fin.System.clearCache(clearCacheOptions).then(() => console.log('Cache cleared')).catch(err => console.log(err));
```
#### Options

* cache: browsing data cache for html files and images ([caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching))
* cookies: browser [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
* localStorage: browser data that can be used across sessions ([local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage))
* appcache: html5 [application cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache)
