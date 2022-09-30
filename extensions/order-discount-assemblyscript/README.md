# AssemblyScript Order Discount

An [AssemblyScript](https://www.assemblyscript.org/)-based discount for VIP customers.

## Notes

* Uses the AssemblyScript [WASI shim](https://github.com/AssemblyScript/wasi-shim) as AssemblyScript no longer supports WASI out of the box.
* Because the shim only provides a low-level API for reading `STDIN`, I attempted to use [as-wasi](https://github.com/jedisct1/as-wasi/). However, [it appears to be broken](https://github.com/jedisct1/as-wasi/issues/127) on the WASI shim at the moment, so the needed Console API has been copied into this module for now.
* The [assemblyscript-json](https://github.com/near/assemblyscript-json) library from NEAR is utilized for JSON parsing and serialization.