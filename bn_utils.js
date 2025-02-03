// Both Truffle and Hardhat with Truffle make an instance of web3 available in the global scope

// BN constants, functions to work with BN
const {BN, toBN, isBN} = require("web3-utils");

// using assert for internal validity/states check
const assert = require("assert");

// crypto is used to get enough randomness for the random BN generation
const {randomBytes} = require("crypto");

// 10^18
const ether = (new BN(10)).pow(new BN(18));

// 10^9
const gwei = (new BN(10)).pow(new BN(9));

// 2^256
const TWO256 = (new BN(2)).pow(new BN(256));

/**
 * Generates a random BN in the range [0, 2^256).
 *
 * @returns {BN} A random BN.
 */
function random_bn256() {
	// use crypto.randomBytes to generate 256 bits of randomness and wrap it into BN
	return new BN(randomBytes(32));
}

/**
 * Generates a random BN in the range [0, 2^255).
 *
 * @returns {BN} A random BN.
 */
function random_bn255() {
	// use crypto.randomBytes to generate 256 bits of randomness, wrap it into BN, reduce to 255 bits
	return new BN(randomBytes(32)).divn(2);
}

/**
 * Generates a random BN of a specified bit length.
 *
 * @param {number} bits The desired bit length.
 * @returns {BN} A random BN.
 */
function random_bits(bits) {
	return new BN(randomBytes(bits >> 3 /* convert bits to bytes */).toString('hex'), 16);
}

/**
 * Generates a random Ethereum address.
 *
 * @returns {string} A random Ethereum address.
 */
function random_address() {
	return web3.eth.accounts.create().address;
}

/**
 * Generates a cryptographically strong pseudo-random HEX string.
 *
 * @param {number} [size=32] The desired byte size of the HEX string.
 * @returns {string} A random HEX string.
 */
function random_hex(size = 32) {
	return web3.utils.randomHex(size);
}

/**
 * Generates a random BN in the range [from, to).
 * The `from` and `to` parameters will be treated as numbers.
 *
 * @param {any} from The lower bound of the range (inclusive).
 * @param {any} to The upper bound of the range (exclusive).
 * @returns {BN} A random BN within the specified range.
 * @throws {Error} If "from" is greater than "to".
 */
function random_bn(from, to) {
	// convert inputs to BNs if they are not BNs
	from = new BN(from);
	to = new BN(to);

	// verify from <= to
	assert(from.lte(to), '"from" must not exceed "to"');

	// generate 256 bits of randomness, a random number R ∈ [0, 2^256)
	const rnd256 = new BN(randomBytes(32));

	// map the random number in a [0, 2^256) space onto [from, from + range) space:
	return from.add(to.sub(from).mul(rnd256).div(TWO256)); // r = R * range / 2^256 + from
}

/**
 * Sums up an array of numeric values (or values that can be converted to BNs).
 * The elements of the array will be treated as numbers.
 *
 * @param {Array<any>} array An array of numeric values.
 * @returns {BN} The sum of the numbers as a BN.
 */
function sum_bn(array) {
	return array.reduce((accumulator, currentVal) => accumulator.add(new BN(currentVal)), new BN(0));
}

/**
 * Provides a user-friendly representation of a big number.
 * The `amt` and `dm` parameters will be treated as numbers.
 *
 * @param {any} amt The amount to format.
 * @param {any} [dm] The divisor. If not provided, defaults to ether if amt > gwei, otherwise 1.
 * @returns {number|string} A user-friendly representation of the amount (e.g., 123, 4.56k, 7.89m, etc.).
 */
function print_amt(amt, dm) {
	// convert inputs to BNs if they are not BNs
	amt = new BN(amt);
	dm = new BN(dm || (amt.gt(gwei)? ether: 1));

	if(amt.isZero()) {
		return 0;
	}
	const isNeg = amt.isNeg();
	if(isNeg) {
		amt = amt.neg();
	}
	const THOUSAND = new BN(1_000);
	const MILLION = THOUSAND.mul(THOUSAND);
	const BILLION = MILLION.mul(THOUSAND);
	const TRILLION = BILLION.mul(THOUSAND);
	let result;
	if(amt.div(dm).lt(THOUSAND)) {
		result = dm.lt(MILLION)? amt.div(dm).toNumber(): amt.div(MILLION).toNumber() / dm.div(MILLION).toNumber();
	}
	else if(amt.div(dm).lt(MILLION)) {
		const k = amt.div(dm).toNumber() / 1_000;
		result = k + "k";
	}
	else if(amt.div(dm).lt(BILLION)) {
		const m = amt.div(dm).div(THOUSAND).toNumber() / 1_000;
		result = m + "m";
	}
	else if(amt.div(dm).lt(TRILLION)) {
		const b = amt.div(dm).div(MILLION).toNumber() / 1_000;
		result = b + "b";
	}
	else {
		const t = amt.div(dm).div(TRILLION).toNumber() / 1_000;
		result = t + "t";
	}
	return isNeg? "-" + result: result;
}

/**
 * Returns a user-friendly string representation of an object.
 * Numbers within the object are converted to strings.
 * Other data types are preserved as-is. Nested objects are recursively processed.
 *
 * @param {object} obj The object to stringify.
 * @param {boolean} [ignore_numeric_keys=true] Whether to ignore numeric keys (e.g., from Web3).
 * @returns {object} A stringified version of the object, with numbers as strings.
 */
function print_obj(obj, ignore_numeric_keys = true) {
	// Helper function to check if a value is a primitive
	function isPrimitive(val) {
		return (val !== Object(val));
	}

	// Recursive function to convert object properties
	function convert(obj) {
		const result = {};
		for(const key in obj) {
			if(obj.hasOwnProperty(key)) {
				if(ignore_numeric_keys && !isNaN(parseInt(key))) {
					continue;
				}
				const value = obj[key];
				if(isPrimitive(value)) {
					result[key] = value;
				}
				else if(typeof value.toString === 'function') {
					result[key] = value.toString();
				}
				else if(typeof value === 'object') {
					result[key] = convert(value);
				}
				else {
					result[key] = value;
				}
			}
		}
		return result;
	}

	return convert(obj);
}

// graphically draw amounts array as a string to be printed in the consoles
// example: [..|.........|................|..........|...||...............|...........................|...|......]
function draw_amounts(amounts) {
	assert(amounts.findIndex(a => a.lt(new BN(0))) < 0, "array contains negative number(s)");

	const delimiters = amounts.length - 1;
	if(delimiters >= 100) {
		return `[${"|".repeat(100)}]`;
	}

	const total_amount = sum_bn(amounts);
	if(delimiters <= 0 || total_amount.isZero()) {
		return `[${".".repeat(100)}]`;
	}

	const amounts_weight = 100 - delimiters;

	// resulting string
	let s = "";
	// rounding down error accumulator
	let remainder = new BN(0);
	// output builder loop builds a string of length 100
	for(let i = 0; i < amounts.length; i++) {
		// current amount to represent
		const amount = new BN(amounts[i]);
		// how many dots to print to represent the amount
		const dots_to_print = amount.add(remainder).muln(amounts_weight).div(total_amount).toNumber();
		// how much we've lost due to rounding down
		remainder = remainder.add(amount).sub(total_amount.muln(dots_to_print).divn(amounts_weight));

		// print the dots
		for(let i = 0; i < dots_to_print; i++) {
			s += ".";
		}
		// print the deliminator
		if(i < amounts.length - 1) {
			s += "|";
		}
	}

	return `[${s}]`;
}

// graphically draw the percent value as a string to be printed in the consoles
// example: [............................................................|.......................................] 60%
function draw_percent(percent) {
	let s = "[";
	for(let i = 0; i < Math.round(percent) - 1; i++) {
		s += ".";
	}
	s += "|";
	for(let i = Math.round(percent); i < 100; i++) {
		s += ".";
	}
	s += `] ${print_percent(percent)}`;
	return s;
}

/**
 * draws values one by one, placing "*" (asterisk) instead of defined non-zero values
 * and " " (whitespace) instead of undefined or zero values
 */
function draw_booleans(arr) {
	return arr.map(s => s? "*": " ").join("");
}

/**
 * draws values one by one, placing " ", ".", "+", "*", or "!" instead of the values
 */
function draw_symbols(
	arr,
	arr_max = arr.reduce((a, v) => a.gte(new BN(v))? a: new BN(v), new BN(0)),
) {
	return arr.map((r, i) => print_symbol(r, arr_max[i] || arr_max)).join("");
}

/**
 * Calculates (a / b) * 100 with 2 digits of decimal precision.
 * The `a` and `b` parameters will be treated as numbers.
 *
 * @param {any} a The numerator.
 * @param {any} b The denominator.
 * @returns {number} The result of (a / b) * 100 with 2 decimal places.
 */
function to_percent(a, b) {
	a = new BN(a);
	b = new BN(b);
	return a.muln(100_00).div(b).toNumber() / 100;
}

/**
 * prints the percent with the 2 digits after the decimal dot precision, like 14.00%
 * @deprecated
 */
function print_percent(percent) {
	return `${percent.toFixed(2)}%`;
}

/**
 * prints values one by one, placing "*" (asterisk) instead of defined non-zero values
 * and " " (whitespace) instead of undefined or zero values
 * @deprecated
 */
function print_booleans(arr) {
	return draw_booleans(arr);
}

// prints a value using one of the following symbols:
// " " (zero),
// "^" (non-zero),
// "." (more than 10% of max),
// "+" (more than 50% of max),
// "*" (max),
// "!" (bigger than max)
function print_symbol(amt, max = amt) {
	// convert inputs to BNs if they are not BNs
	amt = new BN(amt);
	max = new BN(max);

	if(amt.isZero()) {
		return " ";
	}
	if(amt.eq(max)) {
		return "*";
	}
	if(amt.gt(max)) {
		return "!";
	}
	if(amt.lte(max.divn(10))) {
		return ".";
	}
	if(amt.lte(max.divn(2))) {
		return "+";
	}
	return "^";
}
/**
 * prints values one by one, placing " ", ".", "+", "*", or "!" instead of the values
 * @deprecated
 */
function print_symbols(arr, arr_max) {
	return draw_symbols(arr, arr_max);
}

// export public module API
module.exports = {
	BN,
	toBN,
	isBN,
	ether,
	gwei,
	TWO256,
	random_bn256,
	random_bn255,
	random_bits,
	random_address,
	random_hex,
	random_bn,
	sum_bn,
	print_amt,
	print_obj,
	draw_amounts,
	draw_percent,
	draw_booleans,
	draw_symbols,
	to_percent,
	print_percent,
	print_booleans,
	print_symbols,
};
