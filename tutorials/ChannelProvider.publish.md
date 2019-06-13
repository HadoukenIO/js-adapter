Publish an action and payload to every connected client.

### Example
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.register('provider-action', async (payload, identity) => {
        console.log(payload, identity);
        return await Promise.all(provider.publish('client-action', { message: 'Broadcast from provider'}));
    });
})();
```
