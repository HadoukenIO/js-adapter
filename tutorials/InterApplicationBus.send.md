Sends a message to a specific application on a specific topic
# Example
```js
fin.InterApplicationBus.send(fin.me, 'topic', 'Hello there!').then(() => console.log('Message sent')).catch(err => console.log(err));
```
