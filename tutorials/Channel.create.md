A channel can be created with a unique channel name by calling `Channel.create`. If successful, the create method returns a promise that resolves to an instance of the channelProvider bus. The caller then becomes the “channel provider” and can use the channelProvider bus to register actions and middleware.

The caller can also set an onConnection and/or onDisconnection listener that will execute on any new channel connection/disconnection attempt from a channel client. To reject a connection, simply throw an error in the onConnection listener.  The default behavior is to accept all new connections.

A map of client connections is updated automatically on client connection and disconnection and saved in the [read-only] `connections` property on the channelProvider bus.  The channel will exist until the provider destroys it or disconnects by closing or destroying the context (navigating or reloading). To setup a channel as a channelProvider, call `Channel.create` with a unique channel name. A map of client connections is updated automatically on client connection and disconnection.

### Example
```js
(async ()=> {
   // entity creates a channel and becomes the channelProvider
   const providerBus = await fin.InterApplicationBus.Channel.create('channelName');

   providerBus.onConnection((identity, payload) => {
       // can reject a connection here by throwing an error
       console.log('Client connection request identity: ', JSON.stringify(identity));
       console.log('Client connection request payload: ', JSON.stringify(payload));
   });

   providerBus.register('topic', (payload, identity) => {
       // register a callback for a 'topic' to which clients can dispatch an action
       console.log('Action dispatched by client: ', JSON.stringify(identity));
       console.log('Payload sent in dispatch: ', JSON.stringify(payload));
       return {
           echo: payload
       };
   });
})();
```
