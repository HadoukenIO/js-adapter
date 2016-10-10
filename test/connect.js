const { connect } = require("../.")

module.exports = function() {
    return connect(`ws://localhost:9696`, Math.random().toString(36).slice(2))
}