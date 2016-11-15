module.exports = function(delay = 200) {
    return new Promise(resolve => setTimeout(resolve, delay));
}