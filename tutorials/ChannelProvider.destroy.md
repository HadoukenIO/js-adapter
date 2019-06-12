Destroy the channel, raises `disconnected` events on all connected channel clients.

### Example
```js
(async ()=> {
    const provider = await fin.InterApplicationBus.Channel.create('channelName');

    await provider.destroy();
})();
```
