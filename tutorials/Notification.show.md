Invoked when the notification is shown
# Example
```js
fin.Notification.create({
    url: 'https://www.openfin.co'
}).show().then(() => console.log('Notification shown')).catch(err => console.log(err));
```
