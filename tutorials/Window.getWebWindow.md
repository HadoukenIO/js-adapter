Returns the [Window Object](https://developer.mozilla.org/en-US/docs/Web/API/Window) that is available via the global web context and returned by the Window interface's [open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) method. The target window needs to be in the same render process and same domain (same OpenFin Application).


#### Injecting content into an empty window.
In this example we create a blank child window and populte it with some simple html.
```js
(async ()=> {
    try {
        const winName = `child-window-${Date.now()}`;
        const win = await fin.Window.create({
            name: winName,
            url: 'about:blank',
            autoShow: false
        });
        win.getWebWindow().document.body.append = '<h1>Hello World</h1>';
        await win.show();
    } catch (err) {
        console.error(err);
    }
})();
```

#### Cloning DOM elements from the parent window
In this example we get clone an `h3` element from the parent window.
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
            url: 'about:blank',
            autoShow: false
        });
        const template = html`
            <div>
                <span>Click here: </span>
                <button @click=${()=> console.log('Hello World!')}>log to the console</button>
            </div>`;
        render(template, win.getWebWindow().document.body);
        await win.show();

    } catch (err) {
        console.error(err);
    }
})();
```
