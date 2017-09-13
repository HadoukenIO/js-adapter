Sends a message to the notification
# Example
```js
var notification = fin.Notification.create({ url: 'https://openfin.co' });
notification.show().then(() => {
    notification.sendMessage('Hello, World!').then(resp => console.log(resp)).catch(err => console.log(err));
}).catch(err => console.log(err));
```
