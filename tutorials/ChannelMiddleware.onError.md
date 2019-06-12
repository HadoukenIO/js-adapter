Register an error handler. This is called before responding on any error.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    provider.register('provider-action', (payload, identity) => {
        console.log(payload);
        throw new Error('Action error');
        return {
            echo: payload
        };
    });

    provider.onError((action, error, identity) => {
        console.log('uncaught Exception in action:', action);
        console.error(error);
    });

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    client.register('client-action', (payload, identity) => {
        console.log(payload);
        throw new Error('Action error');
        return {
            echo: payload
        };
    });

    client.onError((action, error, identity) => {
        console.log('uncaught Exception in action:', action);
        console.error(error);
    });
})();
```
