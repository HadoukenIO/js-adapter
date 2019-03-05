Retrieves an array containing wrapped fin.Windows that are grouped with this window.
If a window is not in a group an empty array is returned. Please note that
calling window is included in the result array.

# Example
```js
async function getGroup() {
    const app = await fin.Application.start({
        name: 'myApp',
        uuid: 'app-1',
        url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Window.getGroup.html',
        autoShow: true
    });
    const win = await app.getWindow();
    return await win.getGroup();
}

getGroup().then(group => console.log(group)).catch(err => console.log(err));
```
