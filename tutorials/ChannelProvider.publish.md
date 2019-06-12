Publish an action and payload to every connected client.

### Example
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    provider.onConnection(async (identity, payload) => {
        await provider.publish('new-connection', identity);
    });
})();
```
