// we use assert to fail fast in case of any errors
const assert = require("assert");

// functions to convert between unix timestamps and dates
function unix_to_date(unix_timestamp) {
	unix_timestamp = parseInt(unix_timestamp);
	return new Date(unix_timestamp * 1000);
}
function date_to_unix(date) {
	return date.getTime() / 1000 | 0;
}

// prints unix time stamp in a human readable format
// example: 5/8/2027
function print_unix_ts(unix_timestamp, locale = "en-US") {
	const date = unix_to_date(unix_timestamp);
	return date.toLocaleDateString(locale)
}

// prints the duration of seconds in a human readable format
// example: 2y 2M 2w 3d 11h 24m
function print_duration(seconds) {
	const weeks = seconds / 604_800 | 0;
	const days = seconds % 604_800 / 86_400 | 0;
	const hours = seconds % 86_400 / 3600 | 0;
	const minutes = seconds % 3600 / 60 | 0;
	seconds %= 60;

	const result_parts = [];
	if(weeks) {
		result_parts.push(`${weeks}w`);
	}
	if(days) {
		result_parts.push(`${days}d`);
	}
	if(hours) {
		const h = `${hours}`.padStart(2, "0");
		const m = `${minutes}`.padStart(2, "0");
		const s = `${seconds}`.padStart(2, "0");
		result_parts.push(`${h}:${m}:${s}`);
	}
	else if(minutes) {
		const m = `${minutes}`.padStart(2, "0");
		const s = `${seconds}`.padStart(2, "0");
		result_parts.push(`${m}:${s}`);
	}
	else if(seconds) {
		result_parts.push(`${seconds}s`);
	}
	return result_parts.length > 0? result_parts.join(" "): "0";
}

// sums up an array of numbers, returns Number (or whatever inputs are)
function sum_n(array) {
	return array.reduce((accumulator, currentVal) => accumulator + currentVal, 0);
}

// generates random integer in [from, to) range
function random_int(from, to) {
	assert(from <= to, '"from" must not exceed "to"');
	return Math.floor(from + Math.random() * (to - from));
}

// picks random element from the array
function random_element(array, flat = true) {
	assert(array.length, "empty array");
	const i = random_int(0, array.length);
	const e = array[i];
	return flat? e: {e, i};
}

// user-friendly number printer
function print_n(n) {
	const THOUSAND = 1_000;
	const MILLION = 1_000_000;
	const BILLION = 1_000_000_000;

	if(n < THOUSAND) {
		return n + '';
	}
	if(n < MILLION) {
		const k = n / THOUSAND;
		return print_f2(k) + "k";
	}
	if(n < BILLION) {
		const m = n / MILLION;
		return print_f2(m) + "M";
	}
	const b = n / BILLION;
	return print_f2(b) + "G";
}

// prints a number with 2 digits after decimal point
function print_f2(n) {
	return Math.round(n * 100) / 100;
}

// export public module API
module.exports = {
	unix_to_date,
	date_to_unix,
	print_unix_ts,
	print_duration,
	sum_n,
	random_int,
	random_element,
	print_n,
}
