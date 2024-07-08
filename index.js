// Import functions from each module

// block utils
const {
	default_deadline,
	extract_gas,
	extract_gas_cost,
} = require("./block_utils");

// number utils
const {
	unix_to_date,
	date_to_unix,
	print_unix_ts,
	print_duration,
	sum_n,
	random_int,
	random_element,
	print_n,
} = require("./number_utils");

// BN utils
const {
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
} = require("./bn_utils");

// deployment utils
const {
	print_contract_details,
	print_named_contract_details,
} = require("./deployment_utils");

// Re-export the functions
module.exports = {
	default_deadline,
	extract_gas,
	extract_gas_cost,
	unix_to_date,
	date_to_unix,
	print_unix_ts,
	print_duration,
	sum_n,
	random_int,
	random_element,
	print_n,
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
	print_contract_details,
	print_named_contract_details,
};
