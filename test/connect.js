const { connect } = require("../.");

let conn;
module.exports = function() {
    if (!conn) conn = connect({
        address: 'ws://localhost:9696',
        uuid: 'example_uuid' + Math.random()
    });
    return conn;
}

