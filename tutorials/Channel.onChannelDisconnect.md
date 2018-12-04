Listens for any new channel disconnections:

### Example

````js
const listener = (info) => console.log(info); // see return value below

fin.InterApplicationBus.Channel.onChannelDisconnect(channelPayload => {
    console.log(channelPayload);
});

// example shape
{
    "topic": "channel",
    "type": "disconnected",
    "uuid": "OpenfinPOC",
    "name": "OpenfinPOC",
    "channelName": "counter",
    "channelId": "OpenfinPOC/OpenfinPOC/counter"
}

````