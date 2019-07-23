Register middleware that fires before the action.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    provider.register('provider-action', (payload, identity) => {
        console.log(payload, identity);
        return {
            echo: payload
        };
    });

    provider.beforeAction((action, payload, identity) => {
        //The payload can be altered here before handling the action.
        payload.received = Date.now();
        return payload;
    });

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    client.register('client-action', (payload, identity) => {
        console.log(payload, identity);
        return {
            echo: payload
        };
    });

    client.beforeAction((action, payload, identity) => {
        //The payload can be altered here before handling the action.
        payload.received = Date.now();
        return payload;
    });

    const providerResponse = await client.dispatch('provider-action', { message: 'Hello From the client' });
    console.log(providerResponse);
})();
```
