v1.0.14
* fix: improved `web3_tuple_to_object` function to support `BN` values
* fix: improved `web3_tuple_to_object` function not to return null if input is a plain string

v1.0.13
+ added: `web3_tuple_to_object` web3.js contract call result converter to a plain JavaScript object
+ added: `object_matches_expected` convenient objects comparator

v1.0.12
+ added: `print_obj` user-friendly object printer for objects containing big numbers
- deprecated: `print_percent`, `print_booleans`, `print_symbols` functions
+ added: `draw_booleans`, `draw_symbols` instead of deprecated functions

v1.0.11
* fix: fixed typo in README
* fix: limited web3-utils version to ^1.0.0

v1.0.10
* bugfix: use `1 gwei` instead of `1 ether` as an 18 decimal threshold switch in the
  dynamic default "dm" value calculation based on "amt" in print_amt(amt, dm)

v1.0.9
+ added: dynamic default "dm" value calculation based on "amt" in print_amt(amt, dm)

v1.0.8:
* bugfix: don't allow from > to inputs into random_bn(from, to)
* bugfix: do not format simple number as strings in print_amt()

v1.0.7:
+ added: "gwei" 10^9 constant
* bugfix: print_amt to use "b" suffix for billion
+ added: print_amt to support trillions

v1.0.6:
* bugfix: wrong print_amt calculation for 'g'

v1.0.5:
+ added: print_named_contract_details function

v1.0.4:
+ added: index.js re-exporting all the modules for simplified function imports in the client apps

v1.0.3:
* bugfix: draw_amount to properly fit into 100 chars

v1.0.2:
* bugfix: print_amt to work negative numbers
* bugfix: draw_amount to work with zero amounts
+ added: print_unix_ts to print unit timestamp in a human readable format
+ added: print_duration to print duration in seconds in a human readable format

v1.0.1:
+ added: "ether" 10^18 constant
