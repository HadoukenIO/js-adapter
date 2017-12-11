const c = require('./out/src/main')

c.connect({runtime: {version: '8.56.26.50'}, uuid: 'stupid uuid'}).then(fin => console.log('hi'))