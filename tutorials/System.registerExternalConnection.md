This function call will register a unique id and produce a token. The token can be used to broker an external connection
# Example
```js
fin.System.registerExternalConnection("remote-connection-uuid").then(conn => console.log(conn)).catch(err => console.log(err));

/*

object comes back with
    token: "0489EAC5-6404-4F0D-993B-92BB8EAB445D", // this will be unique each time
    uuid: "remote-connection-uuid"

*/
```
