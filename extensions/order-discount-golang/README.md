# Golang Order Discount

A Golang-based discount for VIP customers.

## Notes

* Built with [TinyGo](https://tinygo.org/)
  * To reduce binary size / improve performance, I used leaking garbage collection. Functions are not long lived so this should be acceptable.
* The included build script requires [Binaryen](https://github.com/WebAssembly/binaryen) in your `PATH`, e.g. `brew install binaryen`.
* Because of TinyGo's [limited support for reflection](https://github.com/tinygo-org/tinygo/issues/447), I am using [gjson](https://github.com/tidwall/gjson).