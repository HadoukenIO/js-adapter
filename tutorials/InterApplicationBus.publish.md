Publishes a message to all applications running on OpenFin Runtime that are subscribed to the specified topic.
# Example
```js
fin.InterApplicationBus.publish('topic', 'hello').then(() => console.log('Published')).catch(err => console.log(err));
```
