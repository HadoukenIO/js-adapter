Returns an instance of the main Window of the application
### Example
```js
const { connect, Identity } = require('node-adapter')

const uuid = Math.random().toString(36).slice(2);
connect({
    address: "ws://localhost:9696",
    name: "myApp",
    uuid: uuid
})
.then(App)
.catch(err => console.log(err.message))

function App(fin) {

    async function createApp() {
        const app = await fin.Application.create({ uuid, name: "myApp" })
        await app.run()
        return app
    }

    async function getWindow() {
        const app = await createApp()
        return await app.getWindow()
    }

    getWindow()
    .then(win => console.log(win))
    .catch(err => console.log(err))
}
```
