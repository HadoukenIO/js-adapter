module.exports = function(delay = 50) {
    return new Promise(resolve => setTimeout(resolve, delay))
}