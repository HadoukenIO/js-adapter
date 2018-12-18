Registers an event listener on the specified event. Supported external application event types are:

* connected
* disconnected

### Example

```js
const externalApp = await fin.ExternalApplication.wrap('my-uuid');

// The below functions are provided to add an event listener.
externalApp.addListener("connected", (event) => {
    console.log("The external app connected.");
});

externalApp.on("connected", (event) => {
    console.log("The external app connected.");
});

externalApp.once("connected", (event) => {
    console.log("The external app connected.");
});

externalApp.prependListener("connected", (event) => {
    console.log("The external app connected.");
});

externalApp.prependOnceListener("connected", (event) => {
    console.log("The external app connected.");
});
```
