A connection can be made to a channel as a channelClient by calling `Channel.connect` with a given channel name. The connection request will be routed to the channelProvider if/when the channel is created.

If the connect request is sent prior to creation, the promise will not resolve or reject until the channel is created by a channelProvider (whether or not to wait for creation is configurable in the connectOptions).

The connect call returns a promise that will resolve with a channelClient bus if accepted by the channelProvider, or reject if the channelProvider throws an error to reject the connection. This bus can communicate with the Provider, but not to other clients on the channel. Using the bus, the channelClient can register actions and middleware. Channel lifecycle can also be handled with an onDisconnection listener.

### Example
```js
async function makeClient(channelName) {
   // A payload can be sent along with channel connection requests to help with authentication
   const connectPayload = { payload: 'token' };

   // If the channel has been created this request will be sent to the provider.  If not, the
   // promise will not be resolved or rejected until the channel has been created.
   const clientBus = await fin.InterApplicationBus.Channel.connect(channelName, connectPayload);

   clientBus.onDisconnection(channelInfo => {
       // handle the channel lifecycle here - we can connect again which will return a promise
       // that will resolve if/when the channel is re-created.
       makeClient(channelInfo.channelName);
   })

   clientBus.register('topic', (payload, identity) => {
       // register a callback for a topic to which the channel provider can dispatch an action
       console.log('Action dispatched by provider: ', JSON.stringify(identity));
       console.log('Payload sent in dispatch: ', JSON.stringify(payload));
       return {
           echo: payload
       };
   });
}

makeClient('channelName')
.then(() => console.log('Connected'))
.catch(console.error);
```
