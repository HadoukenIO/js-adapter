Retrieves an array of wrapped fin.desktop.Windows for each of the application’s child windows.
# Example 

```js
async function getChildWindows() {
    const app = await fin.Application.wrap({
        uuid: 'testapp'
    });
    return await app.getChildWindows();
}

getChildWindows().then(childern => console.log(childern)).catch(err => console.error(err));
```