Register middleware that fires after the action. If the action does not return the payload, then the afterAction will not have access to the payload object.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.register('provider-action', (payload, identity) => {
        return {
            echo: payload
        };
    });

    await provider.afterAction((action, payload, identity) => {
        //the payload can be altered here after handling the action but before sending an acknowledgement.
        payload.sent = date.now();
        return payload;
    });

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.register('client-action', (payload, identity) => {
        return {
            echo: payload
        };
    });

    await client.afterAction((action, payload, identity) => {
        //the payload can be altered here after handling the action but before sending an acknowledgement.
        payload.sent = date.now();
        return payload;
    });

})();
```
