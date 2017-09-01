Publishes a message to all applications running on OpenFin Runtime that are subscribed to the specified topic.
#Example
```js
async function publish(topic, message) {
    return await fin.InterApplicationBus.publish(topic, message);
}

publish('topic', 'hello')
.then(() => console.log('Published'));
.catch(err => console.log(err));
```
