Returns an instance of the current window.
# Example
```js
async function getCurrent_and_Flash() {
    const app = await fin.Window.getCurrent();
    return await app.flash();
}

getCurrent_and_Flash().then(() => console.log('Application is flashing')).catch(err => console.error(err))
```