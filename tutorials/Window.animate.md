Performs the specified window transitions.
### Transition Types

#### Opacity
```js
opacity: {
    opacity: 0.5, //This value is clamped from 0.0 to 1.0
    duration: 1000, //The total time in milliseconds this transition should take.
    relative: true //Treat 'opacity' as absolute or as a delta. Defaults to false.
}
```

#### Position
```js
position: {
    left: 10, //Defaults to the window's current left position in virtual screen coordinates.
    top: 25, //Defaults to the window's current top position in virtual screen coordinates.
    duration: 500, //The total time in milliseconds this transition should take.
    relative: true //Treat 'left' and 'top' as absolute or as deltas. Defaults to false.
}
```

#### Size
```js
size: {
    width: 600, //Optional if height is present. Defaults to the window's current width.
    height: 400, //Optional if width is present. Defaults to the window's current height.
    duration: 2500, //The total time in milliseconds this transition should take.
    relative: true //Treat 'width' and 'height' as absolute or as deltas. Defaults to false.
}
```

### Options Object

```js
{
    interrupt: true, // This option interrupts the current animation. When false it pushes this animation onto the end of the animation queue.
    tween: 'ease-in-out' // Transition effect. Defaults to 'ease-in-out'.
}
```

### List of tweens

```js
'linear'
'ease-in'
'ease-out'
'ease-in-out'
'ease-in-quad'
'ease-out-quad'
'ease-in-out-quad'
'ease-in-cubic'
'ease-out-cubic'
'ease-in-out-cubic'
'ease-out-bounce'
'ease-in-back'
'ease-out-back'
'ease-in-out-back'
'ease-in-elastic'
'ease-out-elastic'
'ease-in-out-elastic'
```

# Example
```
async function animateWindow() {
    const transitions = {
        opacity: {
            opacity: 0.7,
            duration: 500
        },
        position: {
            top: 100,
            left: 100,
            duration: 500,
            relative: true
        }
    };
    const options = {
        interrupt: true,
        tween: 'ease-in'
    };

    const win = await fin.Window.getCurrent();
    return win.animate(transitions, options);
}

animateWindow()
    .then(() => console.log('Animation done'))
    .catch(err => console.error(err));
```
