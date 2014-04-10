function triggers(bus) {
	require('./userRegistered')(bus);
}

module.exports = triggers;