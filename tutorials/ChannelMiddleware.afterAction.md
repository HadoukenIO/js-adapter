Register middleware that fires after the action. If the action does not return the payload, then the afterAction will not have access to the payload object.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.register('provider-action', (payload, identity) => {
        console.log(payload);
    });

    await provider.afterAction((action, payload, identity) => {
        //payload is only available if the action registered returns the payload object.
        console.log(action, payload, identity);
    });

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.register('client-action', (payload, identity) => {
        console.log(payload);
    });

    await client.beforeAction((action, payload, identity) => {
        //payload is only available if the action registered returns the payload object.
        console.log(action, payload, identity);
    });

})();
```
