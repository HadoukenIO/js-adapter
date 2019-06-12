Register middleware that fires before the action.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    provider.register('provider-action', (payload, identity) => {
        console.log(payload);
    });

    provider.beforeAction((action, payload, identity) => {
        //we can decorate the payload
        payload.received = date.now();
        return payload;
    });

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    client.register('provider-action', (payload, identity) => {
        console.log(payload);
    });

    client.beforeAction((action, payload, identity) => {
        //we can decorate the payload
        payload.received = date.now();
        return payload;
    });
})();
```
