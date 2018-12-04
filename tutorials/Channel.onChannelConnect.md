Listens for any new channel connections:

### Example

````js
const listener = (info) => console.log(info); // see return value below

fin.InterApplicationBus.Channel.onChannelConnect(channelPayload => {
    console.log(channelPayload);
});

// example shape
{
    "topic": "channel",
    "type": "connected",
    "uuid": "OpenfinPOC",
    "name": "OpenfinPOC",
    "channelName": "counter",
    "channelId": "OpenfinPOC/OpenfinPOC/counter"
}

````