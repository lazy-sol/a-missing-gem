// functions used in deployment scripts (deploy folder) need to be stored in
// a separate place (folder) otherwise hardhat-deploy plugin tries to pick them up
// and execute as part of the deployment routines

// BN utils
const {
	toBN,
	print_amt,
} = require("./bn_utils");

// prints contract details
async function print_contract_details(a0, abi, address, operator_address) {
	return print_named_contract_details(a0, undefined, abi, address, operator_address);
}

// prints contract name and details
async function print_named_contract_details(a0, name = "web3 contract", abi, address, operator_address) {
	// connect to the contract
	const web3_contract = new web3.eth.Contract(abi, address);

	// accumulate data for logging here
	const table_data = [];
	// accumulate same data to be returned here
	let return_data = {};

	// try to read ERC20/ERC721 data
	try {
		const name = await web3_contract.methods.name().call();
		const symbol = await web3_contract.methods.symbol().call();
		const totalSupply = await web3_contract.methods.totalSupply().call();
		return_data = Object.assign(return_data, {name, symbol, totalSupply})
		table_data.push(
			...[
				{"key": "Name", "value": name},
				{"key": "Symbol", "value": symbol},
				{"key": "Total Supply", "value": print_amt(totalSupply)}
			]
		);
	}
	catch(e) {
		// ignored
	}

	// try to read RBAC data
	try {
		const features = toBN(await web3_contract.methods.features().call());
		const r0 = toBN(await web3_contract.methods.getRole(a0).call());
		return_data = Object.assign(return_data, {features, r0})
		table_data.push(
			...[
				{"key": "Features", "value": features.toString(2)}, // 2
				{"key": "Deployer Role", "value": r0.toString(16)}, // 16
			]
		);
		if(operator_address) {
			const r1 = toBN(await web3_contract.methods.getRole(operator_address).call());
			return_data = Object.assign(return_data, {r1});
			table_data.push(
				...[
					{"key": "Operator", "value": operator_address}, // 2
					{"key": "Operator Role", "value": r1.toString(2)}, // 2
				]
			);
		}
	}
	catch(e) {
		// ignored
	}

	// try to read initializable data
	try {
		const version = parseInt(await web3_contract.methods.getInitializedVersion().call());
		return_data = Object.assign(return_data, {version})
		table_data.push(
			...[
				{"key": "Initialized", "value": version? "YES": "NO"},
				{"key": "Version", "value": version},
			]
		);
	}
	catch(e) {
		// ignored
	}

	// try to read proxy data
	try {
		const implementation_address = await web3_contract.methods.getImplementation().call();
		return_data = Object.assign(return_data, {implementation_address})
		table_data.push(
			...[
				{"key": "Implementation Address", "value": implementation_address},
			]
		);
	}
	catch(e) {
		// ignored
	}

	console.log("successfully connected to %s at %o", name, address);

	// log the data if any
	if(table_data.length) {
		console.table(table_data);
	}

	return return_data;
}

// export public module API
module.exports = {
	print_amt,
	print_contract_details,
	print_named_contract_details,
}
