Finds all matches for the specified text in the web page. Returns a promise with the results for the request. By subscribing to the [found-in-page](Window.EventEmitter.md#found-in-page) event, you can get the results of this call as well.

# Example
```js
const win = fin.Window.getCurrentSync();

win.addListener('found-in-page', (event) => {
    console.log(event);
});

win.findInPage('a');
```
