Register a listener that is called on every new client connection. It is passed the identity of the connecting client and a payload if it was provided to Channel.connect. If you wish to reject the connection, throw an error. Be sure to synchronously provide an onConnection upon receipt of the channelProvider to ensure all potential client connections are caught by the listener.

### Example
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    provider.onConnection(identity => {
        console.log('Client connected', identity);
    });
})();
```

### Reject connection example
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    provider.onConnection(identity => {
        throw new Error('Connection Rejected');
    });
})();
```
