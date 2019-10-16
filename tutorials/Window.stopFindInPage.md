Stop a [findInPage](Window.findInPage) call by specifying any of these actions:

* clearSelection - Clear the selection.
* keepSelection - Translate the selection into a normal selection.
* activateSelection - Focus and click the selection node.

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
