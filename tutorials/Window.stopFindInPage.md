Stop findInPage call with the specified action

# Example
```js
const win = fin.Window.getCurrentSync();

win.addListener('found-in-page', (event) => {
    if (!event.result.finalUpdate) {
        win.stopFindInPage('clearSelection');
    }
});

win.findInPage('a');
```
