# AssemblyScript Order Discount

An [AssemblyScript](https://www.assemblyscript.org/)-based discount for VIP customers.

## Notes

* Uses the AssemblyScript [WASI shim](https://github.com/AssemblyScript/wasi-shim) as AssemblyScript no longer supports WASI out of the box.
* Because the shim only provides a low-level API for reading `STDIN`, I am usinguse [as-wasi](https://github.com/jedisct1/as-wasi/). Compatibility with AS 20+ is not yet published on npm, so a github reference is used.
* The [json-as](https://github.com/JairusSW/as-json) library is utilized for JSON parsing and serialization.