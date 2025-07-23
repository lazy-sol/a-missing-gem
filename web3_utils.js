/**
 * Converts a Web3.js contract call result (tuple-like object)
 * into a plain JavaScript object containing only named fields.
 * Optionally parses safe integer strings into native JS numbers.
 *
 * @param raw Web3.js-style result object from a contract method call
 * @param decode_integers Whether to parse numeric strings into integers (default: true)
 * @returns Plain object with named keys and decoded values
 */
function web3_tuple_to_object(raw, decode_integers = true) {
	if (!raw || typeof raw !== "object") return null;

	const result = {};
	for (const key of Object.keys(raw)) {
		// Skip array-style numeric indices (e.g., "0", "1", ...)
		if (!isNaN(Number(key))) continue;

		const value = raw[key];

		if (
			decode_integers &&
			typeof value === "string" &&
			/^\d+$/.test(value)
		) {
			const parsed = Number(value);
			if (Number.isSafeInteger(parsed)) {
				result[key] = parsed;
				continue;
			}
		}

		result[key] = value;
	}

	return result;
}

/**
 * Compares an actual object against expected values.
 * Only keys from the expected object are checked.
 * Ignores additional fields present in the actual object.
 *
 * @param expected Object containing keys and values to verify
 * @param actual Object to be tested against expected values
 * @returns {boolean} true if all expected keys match, false otherwise
 */
function object_matches_expected(expected, actual) {
	if (!expected || typeof expected !== "object") return false;
	if (!actual || typeof actual !== "object") return false;

	for (const key of Object.keys(expected)) {
		if (!(key in actual)) return false;
		if (actual[key] !== expected[key]) return false;
	}
	return true;
}


// export public module API
module.exports = {
	web3_tuple_to_object,
	object_matches_expected,
}
