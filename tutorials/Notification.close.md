Closes the notification
# Example
```js
var notification = fin.Notification.create({ url: 'https://openfin.co' });

notification.show().then(() => {
    notification.close().then(() => console.log('Notification closed')).catch(err => console.log(err));
}).catch(err => console.log(err));
```
