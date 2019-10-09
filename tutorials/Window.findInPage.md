Find and highlight text on a page

# Example
```js
const win = fin.Window.getCurrentSync();

win.addListener('found-in-page', (event) => {
    console.log(event);
});

win.findInPage('a');
```
