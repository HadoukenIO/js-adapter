Registers a default action. This is used any time an action that has not been registered is invoked.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.setDefaultAction((action, payload, identity) => {
        console.log(`Client with identity ${JSON.stringify(identity)} has attempted to dispatch unregistered action: ${action}.`);

        return {
            echo: payload
        };
    });

})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.setDefaultAction((action, payload, identity) => {
        console.log(`Provider with identity ${JSON.stringify(identity)} has attempted to dispatch unregistered action: ${action}.`);

        return {
            echo: payload
        };
    });

})();
```
