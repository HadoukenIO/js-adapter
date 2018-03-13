Writes any unwritten cookies data to disk.

# Example

```js
fin.System.flushCookieStore()
    .then(() => console.log('success'))
    .catch(err => console.error(err));
```
