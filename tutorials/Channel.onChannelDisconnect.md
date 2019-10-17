Listens for any new channel disconnections:

### Example

````js
const listener = (channelPayload) => console.log(channelPayload); // see return value below

fin.InterApplicationBus.Channel.onChannelDisconnect(listener);

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
