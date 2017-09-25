Unsubscribes to messages from the specified application on the specified topic
# Example
```js
async function unsubscribe(topic, listener) {
    return await fin.InterApplicationBus.unsubscribe(fin.me, topic, listener);
}

unsubscribe('topic', () => console.log('Not receiving messages')).then(() => console.log('Unsubscribe')).catch(err => console.log(err));
```
