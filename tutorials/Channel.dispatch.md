Messages can be dispatched from the channelProvider to any channelClient or from any channelClient to the ChannelProvider. This messaging mechanism works exactly the same when messages are dispatched from the provider to a client.

### Channel Provider
Dispatch an action to a specified client. Returns a promise for the result of executing that action on the client side.

```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.onConnection(async (identity, payload) => {
        await provider.dispatch(identity, 'welcome-action', 'Hello, World!');
    });
})();
```

### Channel Client
Dispatch the given action to the channel provider. Returns a promise that resolves with the response from the provider for that action.

```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.dispatch('provider-action', 'Hello From the client');
})();
```
