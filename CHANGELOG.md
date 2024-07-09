v1.0.8:
* bugfix: don't allow from > to inputs into random_bn(from, to)
* bugfix: do not format simple number as strings in print_amt()

v1.0.7:
* added: "gwei" 10^9 constant
* bugfix: print_amt to use "b" suffix for billion
* added: print_amt to support trillions

v1.0.6:
* bugfix: wrong print_amt calculation for 'g'

v1.0.5:
* added: print_named_contract_details function

v1.0.4:
* added: index.js re-exporting all the modules for simplified function imports in the client apps

v1.0.3:
* bugfix: draw_amount to properly fit into 100 chars

v1.0.2:
* bugfix: print_amt to work negative numbers
* bugfix: draw_amount to work with zero amounts
+ added: print_unix_ts to print unit timestamp in a human readable format
+ added: print_duration to print duration in seconds in a human readable format

v1.0.1:
+ added: "ether" 10^18 constant
