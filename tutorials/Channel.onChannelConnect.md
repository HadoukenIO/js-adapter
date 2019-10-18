Listens for any new channel connections:

### Example

````js
const listener = (channelPayload) => console.log(channelPayload); // see return value below

fin.InterApplicationBus.Channel.onChannelConnect(listener);

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
