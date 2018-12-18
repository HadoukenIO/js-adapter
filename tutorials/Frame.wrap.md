Asynchronously returns a reference to the specified frame. The frame does not have to exist.
# Example
```js
fin.Frame.wrap({ uuid: 'testFrame', name: 'testFrame' })
.then(frm => console.log('wrapped frame'))
.catch(err => console.log(err));
```
