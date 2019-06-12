Remove an action by action name.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.register('provider-action', (payload, identity) => {
        console.log(payload);
        return {
            echo: payload
        };
    });

    await provider.remove('provider-action');

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.register('client-action', (payload, identity) => {
        console.log(payload);
        return {
            echo: payload
        };
    });

    await client.remove('client-action');

})();
```
