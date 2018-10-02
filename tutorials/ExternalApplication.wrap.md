Asynchronously returns an External Application object that represents an existing external application.
# Example
```js
fin.ExternalApplication.wrap('javaApp-uuid');
.then(extApp => console.log('wrapped external application'))
.catch(err => console.log(err));
```
