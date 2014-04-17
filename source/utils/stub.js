function stub(obj) {
	Object.keys(obj).forEach(function (key) {
		if (typeof obj[key] === 'function') {
			obj[key] = function () {};
		}
	});

	return obj;
}

module.exports = stub;