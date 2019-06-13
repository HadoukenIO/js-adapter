Register an action to be called by dispatching from any channelClient or channelProvider. The return value will be sent back as an acknowledgement to the original caller. You can throw an error to send a negative-acknowledgement and the error will reject the promise returned to the sender by the dispatch call.  Once a listener is registered for a particular action, it stays in place receiving and responding to incoming messages until it is removed.  This messaging mechanism works exactly the same when messages are dispatched from the provider to a client.  However, the provider has an additional publish method that sends messages to all connected clients.

### Channel Provider
Register an action to be called by clients.
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.register('provider-action', (payload, identity) => {
       console.log('Action dispatched by client: ', identity);
       console.log('Payload sent in dispatch: ', payload);

       return { echo: payload };
   });
})();
```

### Channel Client
Dispatch an action to a specified provider.
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.register('client-action', (payload, identity) => {
       console.log('Action dispatched by client: ', identity);
       console.log('Payload sent in dispatch: ', payload);

       return { echo: payload };
   });
})();
```
