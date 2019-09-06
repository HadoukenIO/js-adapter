Subscribes to messages from the specified application (or "*") on the specified topic.
# Example
```js
// subscribe to a specified application
fin.InterApplicationBus.subscribe(fin.me, 'topic', sub_msg => console.log(sub_msg)).then(() => console.log('Subscribed to the specified application')).catch(err => console.log(err));

// subscribe to wildcard
fin.InterApplicationBus.subscribe({ uuid: '*' }, 'topic', sub_msg => console.log(sub_msg)).then(() => console.log('Subscribed to *')).catch(err => console.log(err));
```
