Retrieves an array of wrapped fin.Windows for each of the application’s child windows.
# Example
```js
async function getChildWindows() {
    const app = await fin.Application.getCurrent();
    return await app.getChildWindows();
}

getChildWindows().then(children => console.log(children)).catch(err => console.log(err));
```
