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

// generates random BN in a [0, 2^256) range: r ∈ [0, 2^256)
function random_bn256() {
	// use crypto.randomBytes to generate 256 bits of randomness and wrap it into BN
	return new BN(randomBytes(32));
}

// generates random BN in a [0, 2^255) range: r ∈ [0, 2^256)
function random_bn255() {
	// use crypto.randomBytes to generate 256 bits of randomness, wrap it into BN, reduce to 255 bits
	return new BN(randomBytes(32)).divn(2);
}

// generates random BN of length `bits`
function random_bits(bits) {
	return new BN(randomBytes(bits >> 3 /* convert bits to bytes */).toString('hex'), 16);
}

// generates random Ethereum address
function random_address() {
	return web3.eth.accounts.create().address;
}

// generates cryptographically strong pseudo-random HEX strings from a given byte size
function random_hex(size = 32) {
	return web3.utils.randomHex(size);
}

// generates random BN in a [from, to) range: r ∈ [from, to)
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

// sums up an array of BNs, returns BN
function sum_bn(array) {
	return array.reduce((accumulator, currentVal) => accumulator.add(new BN(currentVal)), new BN(0));
}

// user friendly big number printer
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

// calculates a/b % with the 2 digits after the decimal dot precision, like 14.55
function to_percent(a, b) {
	a = new BN(a);
	b = new BN(b);
	return a.muln(100_00).div(b).toNumber() / 100;
}

// prints the percent with the 2 digits after the decimal dot precision, like 14.00%
function print_percent(percent) {
	return `${percent.toFixed(2)}%`;
}

// prints a value using "*" (asterisk) if its defined and is not zero, or using " " (whitespace) otherwise
function print_bool(bool) {
	return bool? "*": " ";
}
// prints values one by one, placing "*" (asterisk) instead of defined non-zero values
// and " " (whitespace) instead of undefined or zero values
function print_booleans(arr) {
	return arr.map(s => print_bool(s)).join("");
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
// prints values one by one, placing " ", ".", "+", "*", or "!" instead of the values
function print_symbols(
	arr,
	arr_max = arr.reduce((a, v) => a.gte(new BN(v))? a: new BN(v), new BN(0))
) {
	return arr.map((r, i) => print_symbol(r, arr_max[i] || arr_max)).join("");
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
	draw_amounts,
	draw_percent,
	to_percent,
	print_percent,
	print_booleans,
	print_symbols,
};
