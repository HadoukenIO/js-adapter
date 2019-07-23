Register a listener that is called on client/provider disconnection. It is passed the disconnection event of the disconnecting client/provider.

### Channel Provider
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.onDisconnection(evt => {
        console.log('Client disconnected', `uuid: ${evt.uuid}, name: ${evt.name}`);
    });
})();
```

### Channel Client
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.onDisconnection(evt => {
        console.log('Provider disconnected', `uuid: ${evt.uuid}, name: ${evt.name}`);
    });
})();
```
