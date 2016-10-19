const { connect } = require("../.")

let conn 
module.exports = function() {
    if (!conn) conn = connect(`ws://localhost:9696`, Math.random().toString(36).slice(2))
    return conn
}