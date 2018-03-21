Downloads a version of the runtime. Only supported in an OpenFin Render process.

# Example
```js
var downloadOptions = {
    //Specific version number required, if given a release channel the call will produce an error.
    version: '9.61.30.1'
};

function onProgress(progress) {
    console.log(`${Math.floor((progress.downloadedBytes / progress.totalBytes) * 100)}%`);
}

fin.System.downloadRuntime(downloadOptions, onProgress).then(() => {
    console.log('Download complete');
}).catch(err =>    {
    console.log(`Download Failed, we could retry: ${err.message}`);
    console.log(err);
});
```
