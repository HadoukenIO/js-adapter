Registers an event listener on the specified event. Supported external application event types are:

* connected
* disconnected

### Example

```js
const externalApp = fin.ExternalApplication.wrapSync('my-uuid');

// The below functions are provided to add an event listener.
externalApp.addListener("closed", (event) => {
    console.log("The application is closed in on callback");
});

externalApp.on("closed", (event) => {
    console.log("The application is closed in on callback");
});

externalApp.once("closed", (event) => {
    console.log("The application is closed in once callback");
});

externalApp.prependListener("closed", (event) => {
    console.log("The application is closed in prependListener callback");
});

externalApp.prependOnceListener("closed", (event) => {
    console.log("The application is closed in prependOnceListener callback");
});
```
