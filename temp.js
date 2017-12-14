const c = require('./out/src/main')

c.connect({runtime: {version: 'stable'}, uuid: 'stupid uuid'}).then(fin => console.log('hi'))