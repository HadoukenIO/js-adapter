The Channel namespace allows an OpenFin application to create a channel as a ChannelProvider  or connect to a channel as a ChannelClient. A request to connect to a channel as a client will return a promise that resolves if/when the channel has been created. Both the provider and client can dispatch actions that have been registered on their opposites, and dispatch returns a promise that resolves with a payload from the other communication participant. There can be only one provider per channel, but many clients.

### Example

````js
// Create the channel with channelName `counter` as a provider:

async function makeProvider() {
    let x = 0;
    const channelName = 'counter';
    const provider = await fin.InterApplicationBus.Channel.create(channelName);
    provider.onConnection((identity, payload) => {
        console.log('onConnection identity: ', JSON.stringify(identity));
        console.log('onConnection payload: ', JSON.stringify(payload));
    });
    provider.onDisconnection((identity) => {
        console.log('onDisconnection identity: ', JSON.stringify(identity));
    });
    provider.register('getValue', (payload, identity) => {
        console.log('Value of x requested from', identity);
        return x;
    });
    provider.register('increment', () => ++x);
    provider.register('incrementBy', (payload) => x += payload.amount);
    provider.register('throwError', () => {
        throw new Error('Error in channelProvider')
    });

    return {
        publishToClients: (msg) => provider.publish('pushMessage', msg)
    }
}

let channelProvider;
makeProvider().then(async (providerBus) => {
    channelProvider = providerBus
    console.log('Channel has been created and saved in variable "channelProvider".');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const responseArray = providerBus.publishToClients('Example message from provider');
    responseArray.forEach(promiseResponse => {
        promiseResponse.then(console.log);
    });
});

````


````js
// From another window or application, connect to the 'counter' channel as a client:

async function makeClient() {
    const connectPayload = { payload: 'place connection payload here' };
    const client = await fin.InterApplicationBus.Channel.connect('counter', connectPayload);

    client.register('pushMessage', (payload, identity) => {
        console.log(`Payload: ${JSON.stringify(payload)} sent from channel provider with identity: ${JSON.stringify(identity)}`);
        const me = fin.Window.getCurrentSync().identity;
        return `Push message received by ${JSON.stringify(me)}`;
    });

    return {
        getValue: () => client.dispatch('getValue'),
        increment: () => client.dispatch('increment'),
        incrementBy: (x) => client.dispatch('incrementBy', {amount: x}),
        throwError: () => client.dispatch('throwError'),
        unregisteredAction: () => client.dispatch('unregisteredAction')
    }
}

let channelClient;
makeClient().then(async (clientBus) => {
    channelClient = clientBus;
    console.log('Connected to Channel, client bus saved in variable "channelClient".');
    const one = await clientBus.increment();
    console.log('counter number: ', one);
    const eleven = await clientBus.incrementBy(10);
    console.log('counter number: ', eleven);
    try{
        const error = await clientBus.throwError();
    } catch (e) {
        console.error(e);
    }
});

````