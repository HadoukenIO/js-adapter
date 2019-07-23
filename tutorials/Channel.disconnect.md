Disconnect from the channel.

### Example
```js
(async ()=> {
    const client = await fin.InterApplicationBus.Channel.connect('channelName');

    await client.disconnect();
})();
```
