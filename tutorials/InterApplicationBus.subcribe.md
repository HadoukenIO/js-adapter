Subscribes to messages from the specified application on the specified topic.
#Example
```js
async function subcribe(topic, listener) {
    return await fin.InterApplicationBus.subscribe({
        uuid: 'app-1'
    }, topic, listener);
}

subcribe('topic', sub_msg => {
    // What does the subsciprtion do on incoming publishes
    console.log(sub_msg);
});
```
