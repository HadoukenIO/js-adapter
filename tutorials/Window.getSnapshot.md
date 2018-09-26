Gets a base64 encoded PNG snapshot of the window

# Example
```js
(async () => {
    const wnd = await fin.Window.getCurrent();

    // Snapshot of a full visible window
    console.log(await wnd.getSnapshot());

    // Snapshot of a defined visible area of the window
    const area = {
        height: 100,
        width: 100,
        x: 10,
        y: 10,
    };
    console.log(await wnd.getSnapshot(area));
})();
```
