Channel middleware functions receive the following arguments: (action, payload, senderId).  The return value of the middleware function will be passed on as the payload from beforeAction, to the action listener, to afterAction unless it is undefined, in which case the most recently defined payload is used.  Middleware can be used for side effects. 

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
    provider.setDefaultAction((action, payload, identity) => {
        console.log(`Client with identity ${JSON.stringify(identity)} has attempted to dispatch unregistered action: ${action}.`);
        return `Action: ${action} not registered on channel: ${channelName}`;
    });
    provider.onError((action, error, identity) => {
        console.log(`Error related to ${action} sent by ${JSON.stringify(identity)}: ${JSON.stringify(error)}`);
        return `Error thrown related to action: ${action} on channel: ${channelName}`;
    });
    provider.beforeAction((action, payload, identity) => {
        console.log(`The payload ${JSON.stringify(payload)} from ${JSON.stringify(identity)} can be altered here before handling the action: ${action}.`);
        return payload;
    });
    provider.afterAction((action, payload, identity) => {
        console.log(`The response payload ${JSON.stringify(payload)} can be altered here before being sent as an ack to ${JSON.stringify(identity)}.`);
        return payload;
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

let provider;
makeProvider().then(async (providerBus) => {
    provider = providerBus
    console.log('Channel has been created and saved in variable "provider".');
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
    client.setDefaultAction((action, payload, identity) => {
        console.log(`Provider with identity ${JSON.stringify(identity)} has attempted to dispatch unregistered action: ${action}.`);
    });
    client.onError((error, action, identity) => {
        console.log(`Error related to ${action} sent by ${JSON.stringify(identity)}: ${JSON.stringify(error)}`);
    });
    client.beforeAction((action, payload, identity) => {
        console.log(`The payload ${JSON.stringify(payload)} from ${JSON.stringify(identity)} can be altered here before handling the action: ${action}.`);
        return payload;
    });
    client.afterAction((action, payload, identity) => {
        console.log(`The response payload ${JSON.stringify(payload)} can be altered here before being sent as an ack to ${JSON.stringify(identity)}.`);
        return payload;
    });

    return {
        getValue: () => client.dispatch('getValue'),
        increment: () => client.dispatch('increment'),
        incrementBy: (x) => client.dispatch('incrementBy', {amount: x}),
        throwError: () => client.dispatch('throwError'),
        unregisteredAction: () => client.dispatch('unregisteredAction')
    }
}

let client;
makeClient().then(async (clientBus) => {
    client = clientBus;
    console.log('Connected to Channel, client bus saved in variable "client".');
    const one = await clientBus.increment();
    console.log('counter number: ', one);
    const eleven = await clientBus.incrementBy(10);
    console.log('counter number: ', eleven);
    const unregistered = await clientBus.unregisteredAction();
    console.log(unregistered);
    const error = await clientBus.throwError();
    console.log(error);
});

````