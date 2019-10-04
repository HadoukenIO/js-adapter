Creates a new View.
# Example
```js
async function createView() {
    const me = await fin.Window.getCurrent();
    return fin.View.create({ 
        url: 'https://google.com', 
        name: 'browserViewNameCreate', 
        target: me.identity, 
        bounds: {x: 10, y: 10, width: 200, height: 200} 
    });
}

createView().then(() => console.log('View created.')).catch(err => console.log(err));
```
