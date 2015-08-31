
var log = {};

log.log = function() {
	console.log.apply(console, arguments);
};
log.info = function() {
	console.info.apply(console, arguments);
};
log.error = function() {
	console.error.apply(console, arguments);
};

module.exports = log;
