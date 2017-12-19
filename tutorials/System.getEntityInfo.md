Returns a frame info object relating to the entity specified by the uuid and name passed in.
The possible types are 'window', 'iframe', 'external connection' or 'unknown'.
# Example
```js
const entityUuid = 'OpenfinPOC';
const entityName = '40c74b5d-ed98-40f7-853f-e3d3c2699175';
fin.System.getEntityInfo(entityUuid, entityName).then(info => console.log(info)).catch(err => console.log(err));

// example info shape
{
    "uuid": "OpenfinPOC",
    "name": "40c74b5d-ed98-40f7-853f-e3d3c2699175",
    "parent": {
        "uuid": "OpenfinPOC",
        "name": "OpenfinPOC"
    },
    "entityType": "iframe"
}
```
