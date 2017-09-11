Sends a message to the notification
# Example
```js
fin.Notification.create({ url: 'https://www.google.com' }).sendMessage('Hello, World!').then(resp => console.log(resp)).catch(err => console.log(err));
```
