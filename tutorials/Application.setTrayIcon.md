Adds a customizable icon in the system tray and notifies the application when clicked.
# Example
```js
const imageUrl = "http://cdn.openfin.co/assets/testing/icons/circled-digit-one.png";
const base64EncodedImage = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABKVBMVEUAAABSTf9QTP9TUP9RTf9jXP9PS/9SUP9OSv9QTf9TTv9VUP9PSf9RTv9WTv9KRv9RTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTf9QTP9QTP9QTP9UUP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9TTv9RTf9QTP9QTP9QTP9QTP9RTf9QTP9QTP9QTf9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9RTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9QTP9RTf9QTP9QTP9QTP9QTf9QTP9QTP9QTP9TT/9QTP9UUf9QTP////+c69uyAAAAYXRSTlMAAAAAAAAAAAAAAAAAAAAADm3R+PnScA8QmZwSfP2AAR/a3CFHS1T8/l478n0Rwr9Q7QEDXexsDQJIPAEmb5qrzve+eVoe2/PDE1gN7i9uzxSs0FcOLg4S3voT3cBKAV8BobrzZQAAAAFiS0dEYiu5HTwAAAAHdElNRQfiAgQJJyMViSyGAAABjklEQVQ4y31TeV+CQBBdRzqorBQENDQTz9LSsLIShQ5LLY+s7DCN7/8lEmHXa3P+25n3e/vmzQxCJFyw6/VxvF8QwY1oAVKAM0fBB/eAVmdW5JA5jlB4n6ERRA5MJ6IKjQJiHAbwcSogkcSAVJoKODzCADMDFBGQPSaAE5FCwUAuT0R4TykUjFqIphzE2fnF6hrOFyOXiavsOoPY65JWruiGheBubu9i90XG8k+ucsmHx5xqkW5sqrW63+mFq8oSoEbA9u+psMWOGT3w7MNakoEGahrOo1oCrLaOc6bRRC3SWxO2nYbbOkm2EPHXLO8wuJ0OSXJTgI5KBRBBpt6GxS9ekEAojK49AXZKJCeg12AIv3xv4JltMxR8R9ALf3w6Dvu6NVX96mKj+O9wDyyrlXha7o9/MvQKtrovp3+UIksWWtTIKK3IayK4Zkc50PhJndcGC+MGqT8B9KXFhXFBZgLIzPHbFEO8LWZqSF3aOBHxz9or0eWHw/yGl5/eyNMgbx9vj3q8yA2i4Ofnz/8PB9agG+57b98AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDItMDRUMDk6Mzk6MzUrMDE6MDDl1ju7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAyLTA0VDA5OjM5OjM1KzAxOjAwlIuDBwAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==";

async function setTrayIcon(icon) {
    const app = await fin.Application.getCurrent();
    return await app.setTrayIcon(icon);
}

// use image url to set tray icon
setTrayIcon(imageUrl).then(() => console.log('Setting tray icon')).catch(err => console.log(err));

// use base64 encoded string to set tray icon
setTrayIcon(base64EncodedImage).then(() => console.log('Setting tray icon')).catch(err => console.log(err));
```
