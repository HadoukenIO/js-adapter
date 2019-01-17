Sends a message to the notification
# Example
```js
var notification = fin.Notification.create({ url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Notification.sendMessage.html' });
notification.show().then(() => {
    notification.sendMessage('Hello, World!').then(() => console.log('Message sent')).catch(err => console.log(err));
}).catch(err => console.log(err));
```
