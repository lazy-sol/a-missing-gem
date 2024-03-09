# A Missing Gem #
A collection of functions accidentally not included into web3.js and Ethers.js

## Prerequisites ##
* `web3` object available in the global namespace.
  Both Truffle and Hardhat with Truffle make an instance of web3 available in the global scope.

## Installation ##
```shell
npm i @lazy-sol/a-missing-gem
```

## Usage ##
The package is used as a __library__ in projects built with Truffle or Hardhat with Truffle.

### Printing an Account Balance ###

Code:
```javascript
// BN utils
const {
	print_amt,
} = require("@lazy-sol/a-missing-jem/bn_utils");

// get the account balance as BN
const balance = await web3.eth.getBalance("0x000000000000000000000000000000000000dEaD");

// print the BN in human readable format
console.log("balance: %o ETH", print_amt(balance));
```

Output:
```text
balance: '10k' ETH
```

### Extracting Gas Usage From Transaction Receipt ###
```
// block utils
const {
	extract_gas,
} = require("../include/block_utils");

// send the transaction to get the tx receipt
const receipt = await web3.eth.sendTransaction({
	from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
	to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
	value: '1000000000000000'
});

// extract the gas used
const gasUsed = extract_gas(receipt);

// print
console.log("gas used: %o", gasUsed);
```

Output:
```text
gas used: 21000
```

More usage examples to come.
The library is used in almost all the repos in [Lazy So[u]l Org.](https://github.com/lazy-sol/).

## Contributing
Please see the [Contribution Guide](./CONTRIBUTING.md) document to get understanding on how to report issues,
contribute to the source code, fix bugs, introduce new features, etc.

(c) 2017–2024 Basil Gorin
