Returns the [Window Object](https://developer.mozilla.org/en-US/docs/Web/API/Window) that represents the web context of the target window. This is the same object that you would get from calling [window.open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) in a standard web context. The target window needs to be in the same application as the requesting window as well as comply with [same-origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) policy requirements.


#### Injecting content into an empty window.
In this example we create a blank child window and populte it with some simple html.
```js
(async ()=> {
    try {
        const winName = `child-window-${Date.now()}`;
        const win = await fin.Window.create({
            name: winName,
            url: 'about:blank'
        });
        win.getWebWindow().document.write('<h1>Hello World</h1>');
    } catch (err) {
        console.error(err);
    }
})();
```

#### Cloning DOM elements from the parent window
In this example we clone an `h3` element from the parent window.
```js
(async ()=> {
    try {
        const currentWindow = await fin.Window.getCurrent();
        const parentWindow = await currentWindow.getParentWindow();
        const clonedH3 = parentWindow.getWebWindow().document.querySelector('h3').cloneNode(true);
        document.body.append(clonedH3);

    } catch (err) {
        console.error(err);
    }
})();
```

#### Rendering on a child window via a library
In this example we are using the [lit-html](https://lit-html.polymer-project.org/) template library to render content on a blank child window. you are not going to be able to copy paste this example without configuring the project correctly but this would demonstrate some templeting options available.
```js
(async ()=> {
    try {
        const win = await fin.Window.create({
            name: `child-window-${Date.now()}`,
            url: 'about:blank'
        });
        const template = html`
            <div>
                <span>Click here: </span>
                <button @click=${()=> console.log('Hello World!')}>log to the console</button>
            </div>`;
        render(template, win.getWebWindow().document.body);

    } catch (err) {
        console.error(err);
    }
})();
```
