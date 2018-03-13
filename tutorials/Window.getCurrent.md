Returns a Window object that represents the current window

# Example
```js
async function getCurrentWindowBounds () {
    const win = await fin.Window.getCurrent();

    return win.getBounds();
}

getCurrentWindowBounds().then(bounds => {
    console.log('the current window bounds are:');
    console.log(bounds);
}).catch(err => {
    console.error(err);
});

```
