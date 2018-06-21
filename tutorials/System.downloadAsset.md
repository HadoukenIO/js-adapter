Downloads the given application asset.

# Example
```js
async function downloadAsset() {
    const appAsset = {
        src: `${ location.origin }/assets.zip`,
        alias: 'dirApp',
        version: '1.23.24',
        target: 'assets/run.bat'
    };

    return fin.System.downloadAsset(appAsset, (progress => {
    //Print progress as we download the asset.
        const downloadedPercent = Math.floor((progress.downloadedBytes / progress.totalBytes) * 100);
        console.log(`Downloaded ${downloadedPercent}%`);
    }));
}

downloadAsset()
.then(() => console.log('Success'))
.catch(err => console.error(err));

```
