Subscribes to messages from the specified application on the specified topic.
# Example
```js
async function subcribe(topic, listener) {
    return await fin.InterApplicationBus.subscribe({
        uuid: fin.me.uuid
    }, topic, listener);
}

subcribe('topic', sub_msg => {
    console.log(sub_msg);
}).then(resp => console.log('Subscribed')).catch(err => console.log(err));
```
