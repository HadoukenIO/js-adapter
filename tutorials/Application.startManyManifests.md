Asynchronously starts a batch of applications given an array of application identifiers and manifestUrls.
Returns once the RVM is finished attempting to launch the applications.
# Example
```js

const applicationInfoArray = [
    {
        "uuid": 'App-1',
        "manifestUrl": 'http://localhost:5555/app1.json',
    },
    {
        "uuid": 'App-2',
        "manifestUrl": 'http://localhost:5555/app2.json',
    },
    {
        "uuid": 'App-3',
        "manifestUrl": 'http://localhost:5555/app3.json',
    }
]

fin.Application.startManyManifests(applicationInfoArray)
    .then(() => {
        console.log('RVM has finished launching the application list.');
    })
    .catch((err) => {
        console.log(err);
    })
```

